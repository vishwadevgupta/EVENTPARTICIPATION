const fs=require('fs');
const path=require('path');
const Database=require('better-sqlite3');
const bcrypt=require('bcryptjs');
require('dotenv').config();

const file=process.env.DB_FILE||'./data/sep.db';
const absolute=path.resolve(file);
fs.mkdirSync(path.dirname(absolute),{recursive:true});
const db=new Database(absolute);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE COLLATE NOCASE,
 password_hash TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student','admin')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS events(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL,
 category TEXT NOT NULL,
 description TEXT NOT NULL,
 venue TEXT NOT NULL,
 event_date TEXT NOT NULL,
 capacity INTEGER NOT NULL DEFAULT 100 CHECK(capacity>0),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS registrations(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
 status TEXT NOT NULL DEFAULT 'registered' CHECK(status IN ('registered','cancelled','attended')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(user_id,event_id)
);
`);

const count=db.prepare('SELECT COUNT(*) count FROM events').get().count;
if(!count){
 const insert=db.prepare('INSERT INTO events(title,category,description,venue,event_date,capacity) VALUES(?,?,?,?,?,?)');
 const seed=db.transaction(()=>{
  insert.run('Build Beyond the Classroom','tech','Hands-on innovation workshop for students who like turning ideas into prototypes.','Innovation Lab · Main Block','2026-09-18T10:00:00',80);
  insert.run('Campus After Dark','culture','An evening of music, food, student clubs and unexpected collaborations.','Open Air Theatre','2026-09-24T17:30:00',150);
  insert.run('Inter-Department Cup','sports','A friendly tournament across departments. Bring your team and the energy.','University Ground','2026-09-28T16:00:00',120);
  insert.run('Future Forum','tech','Talks from students and mentors on technology, careers and what comes next.','Main Auditorium','2026-10-02T11:00:00',200);
 });
 seed();
}
const adminEmail=process.env.ADMIN_EMAIL;
const adminPassword=process.env.ADMIN_PASSWORD;
if(adminEmail&&adminPassword){
 const exists=db.prepare('SELECT id FROM users WHERE email=?').get(adminEmail);
 if(!exists) db.prepare('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)').run('Administrator',adminEmail,bcrypt.hashSync(adminPassword,12),'admin');
}
module.exports=db;