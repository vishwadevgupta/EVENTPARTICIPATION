// Shared browser helpers for SEP.
const SEP_API='';
const getToken=()=>localStorage.getItem('sep_token');
const setSession=(data)=>{localStorage.setItem('sep_token',data.token);localStorage.setItem('sep_user',JSON.stringify(data.user));};
const clearSession=()=>{localStorage.removeItem('sep_token');localStorage.removeItem('sep_user');};
const currentUser=()=>{try{return JSON.parse(localStorage.getItem('sep_user'));}catch{return null;}};
async function api(path,options={}){const headers={'Content-Type':'application/json',...(options.headers||{})};const token=getToken();if(token)headers.Authorization='Bearer '+token;const r=await fetch(SEP_API+path,{...options,headers});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Request failed');return data;}
