const express=require('express');
const path=require('path');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');
require('dotenv').config();
const db=require('./db');

const app=express();
const PORT=Number(process.env.PORT||3000);
const JWT_SECRET=process.env.JWT_SECRET;
if(!JWT_SECRET){console.error('JWT_SECRET is required. copy config/.env.example to .env and set a secret.');process.exit(1);}

app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:'100kb'}));
app.use(express.urlencoded({extended:false}));
const authLimiter=rateLimit({windowMs:15*60*1000,max:30,standardHeaders:true,legacyHeaders:false,message:{error:'Too many authentication attempts. Try again later.'}});
app.use((req,res,next)=>{if(/^\/(server\.js|db\.js|package\.json|\.env|\.env\.example)(\/|$)/.test(req.path)||req.path.startsWith('/data/'))return res.status(404).end();next();});
app.use(express.static(path.join(__dirname,'../frontend'),{extensions:['html']}));

function auth(req,res,next){
 const header=req.headers.authorization||'';
 const token=header.startsWith('Bearer ')?header.slice(7):null;
 if(!token)return res.status(401).json({error:'Authentication required'});
 try{req.user=jwt.verify(token,JWT_SECRET);next();}
 catch{res.status(401).json({error:'Invalid or expired token'});}
}
function admin(req,res,next){if(req.user.role!=='admin')return res.status(403).json({error:'Admin access required'});next();}
function cleanUser(u){return{id:u.id,name:u.name,email:u.email,role:u.role};}

app.get('/api/health',(req,res)=>res.json({status:'ok',service:'SEP API'}));

app.get('/api/events',(req,res)=>{
 const category=String(req.query.category||'all').toLowerCase();
 const q=String(req.query.q||'').trim();
 let sql=`SELECT e.*,COUNT(CASE WHEN r.status='registered' THEN 1 END) registered_count
 FROM events e LEFT JOIN registrations r ON r.event_id=e.id`;
 const where=[],params=[];
 if(category!=='all'){where.push('LOWER(e.category)=?');params.push(category);}
 if(q){where.push('(LOWER(e.title) LIKE ? OR LOWER(e.description) LIKE ? OR LOWER(e.venue) LIKE ?)');const term='%'+q.toLowerCase()+'%';params.push(term,term,term);}
 if(where.length)sql+=' WHERE '+where.join(' AND ');
 sql+=' GROUP BY e.id ORDER BY datetime(e.event_date) ASC';
 const events=db.prepare(sql).all(...params).map(e=>({...e,available:e.capacity-e.registered_count}));
 res.json(events);
});

app.get('/api/events/:id',(req,res)=>{
 const e=db.prepare(`SELECT e.*,COUNT(CASE WHEN r.status='registered' THEN 1 END) registered_count FROM events e LEFT JOIN registrations r ON r.event_id=e.id WHERE e.id=? GROUP BY e.id`).get(req.params.id);
 if(!e)return res.status(404).json({error:'Event not found'});
 res.json({...e,available:e.capacity-e.registered_count});
});

app.post('/api/auth/register',authLimiter,async(req,res)=>{
 const {name,email,password}=req.body;
 if(!name||!email||!password)return res.status(400).json({error:'Name, email and password are required'});
 if(password.length<8)return res.status(400).json({error:'Password must be at least 8 characters'});
 if(!/^\S+@\S+\.\S+$/.test(email))return res.status(400).json({error:'Enter a valid email address'});
 try{
  const hash=await bcrypt.hash(password,12);
  const result=db.prepare('INSERT INTO users(name,email,password_hash) VALUES(?,?,?)').run(name.trim(),email.trim().toLowerCase(),hash);
  res.status(201).json({message:'Account created',user:{id:result.lastInsertRowid,name:name.trim(),email:email.trim().toLowerCase(),role:'student'}});
 }catch(e){if(String(e.message).includes('UNIQUE'))return res.status(409).json({error:'An account with this email already exists'});res.status(500).json({error:'Unable to create account'});}
});

app.post('/api/auth/login',authLimiter,async(req,res)=>{
 const {email,password}=req.body;
 if(!email||!password)return res.status(400).json({error:'Email and password are required'});
 const user=db.prepare('SELECT * FROM users WHERE email=?').get(email.trim().toLowerCase());
 if(!user||!(await bcrypt.compare(password,user.password_hash)))return res.status(401).json({error:'Invalid email or password'});
 const token=jwt.sign({id:user.id,name:user.name,email:user.email,role:user.role},JWT_SECRET,{expiresIn:'2h'});
 res.json({token,user:cleanUser(user)});
});

app.get('/api/me',auth,(req,res)=>res.json({user:req.user}));

app.get('/api/my/registrations',auth,(req,res)=>{
 const rows=db.prepare(`SELECT r.id,r.status,r.created_at,e.id event_id,e.title,e.category,e.venue,e.event_date FROM registrations r JOIN events e ON e.id=r.event_id WHERE r.user_id=? ORDER BY datetime(e.event_date) DESC`).all(req.user.id);
 res.json(rows);
});

app.post('/api/events/:id/register',auth,(req,res)=>{
 const event=db.prepare(`SELECT e.*,COUNT(CASE WHEN r.status='registered' THEN 1 END) registered_count FROM events e LEFT JOIN registrations r ON r.event_id=e.id WHERE e.id=? GROUP BY e.id`).get(req.params.id);
 if(!event)return res.status(404).json({error:'Event not found'});
 if(event.registered_count>=event.capacity)return res.status(409).json({error:'This event is full'});
 try{db.prepare('INSERT INTO registrations(user_id,event_id) VALUES(?,?)').run(req.user.id,event.id);res.status(201).json({message:'Registration confirmed'});}
 catch(e){if(String(e.message).includes('UNIQUE'))return res.status(409).json({error:'You are already registered for this event'});res.status(500).json({error:'Unable to register'});}
});

app.delete('/api/events/:id/register',auth,(req,res)=>{
 const result=db.prepare("UPDATE registrations SET status='cancelled' WHERE user_id=? AND event_id=? AND status='registered'").run(req.user.id,req.params.id);
 if(!result.changes)return res.status(404).json({error:'Active registration not found'});
 res.json({message:'Registration cancelled'});
});

app.post('/api/events',auth,admin,(req,res)=>{
 const {title,category,description,venue,event_date,capacity}=req.body;
 if(!title||!category||!description||!venue||!event_date)return res.status(400).json({error:'All event fields are required'});
 const result=db.prepare('INSERT INTO events(title,category,description,venue,event_date,capacity) VALUES(?,?,?,?,?,?)').run(title,category,description,venue,event_date,Number(capacity)||100);
 res.status(201).json(db.prepare('SELECT * FROM events WHERE id=?').get(result.lastInsertRowid));
});

app.get('/api/admin/registrations',auth,admin,(req,res)=>{
 res.json(db.prepare(`SELECT r.id,r.status,r.created_at,u.name,u.email,e.title,e.event_date FROM registrations r JOIN users u ON u.id=r.user_id JOIN events e ON e.id=r.event_id ORDER BY datetime(r.created_at) DESC`).all());
});

app.use('/api',(req,res)=>res.status(404).json({error:'API route not found'}));
app.listen(PORT,()=>console.log(`SEP running at http://localhost:${PORT}`));