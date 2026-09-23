const getToken=()=>localStorage.getItem('sep_token');
const getUser=()=>{try{return JSON.parse(localStorage.getItem('sep_user'));}catch{return null;}};
const setSession=data=>{localStorage.setItem('sep_token',data.token);localStorage.setItem('sep_user',JSON.stringify(data.user));};
const clearSession=()=>{localStorage.removeItem('sep_token');localStorage.removeItem('sep_user');};
async function api(path,options={}){
 const headers={'Content-Type':'application/json',...(options.headers||{})};
 const token=getToken();if(token)headers.Authorization='Bearer '+token;
 const response=await fetch(path,{...options,headers});
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(data.error||'Something went wrong');
 return data;
}
