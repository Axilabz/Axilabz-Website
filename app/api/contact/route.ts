import { env } from 'cloudflare:workers';

const interests=['general','custom-ai','axivoice','axidoc','axicore','engagement'];
const budgets=['under-5k','5k-15k','15k-50k','50k-plus'];
const timelines=['asap','1-3-months','3-6-months','exploring'];

type Secrets={FIREBASE_PROJECT_ID?:string;FIREBASE_CLIENT_EMAIL?:string;FIREBASE_PRIVATE_KEY?:string};
function secrets():Secrets{const e=env as unknown as Secrets;const p=typeof process!=='undefined'?process.env as Secrets:{};return{FIREBASE_PROJECT_ID:e.FIREBASE_PROJECT_ID||p.FIREBASE_PROJECT_ID,FIREBASE_CLIENT_EMAIL:e.FIREBASE_CLIENT_EMAIL||p.FIREBASE_CLIENT_EMAIL,FIREBASE_PRIVATE_KEY:e.FIREBASE_PRIVATE_KEY||p.FIREBASE_PRIVATE_KEY};}
const b64url=(b:ArrayBuffer|string)=>btoa(typeof b==='string'?b:String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');

async function accessToken(s:Secrets){
 const now=Math.floor(Date.now()/1000);
 const head=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
 const claim=b64url(JSON.stringify({iss:s.FIREBASE_CLIENT_EMAIL,scope:'https://www.googleapis.com/auth/datastore',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));
 const pem=s.FIREBASE_PRIVATE_KEY!.replace(/\\n/g,'\n').replace(/-----[^-]+-----/g,'').replace(/\s+/g,'');
 const key=await crypto.subtle.importKey('pkcs8',Uint8Array.from(atob(pem),c=>c.charCodeAt(0)),{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);
 const sig=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,new TextEncoder().encode(`${head}.${claim}`));
 const res=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:`${head}.${claim}.${b64url(sig)}`})});
 if(!res.ok)throw new Error('token');return (await res.json() as {access_token:string}).access_token;
}
async function sha256(v:string){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)))].map(b=>b.toString(16).padStart(2,'0')).join('');}
const str=(v:string|null)=>v===null?{nullValue:null}:{stringValue:v};

export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Request origin not allowed.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'JSON required.'},{status:415});
 try{
  const body=await request.text();if(body.length>16000)return Response.json({error:'Request too large.'},{status:413});
  const data=JSON.parse(body);if(data.website)return Response.json({ok:true});
  const t=(v:unknown)=>typeof v==='string'?v.trim():'';
  const name=t(data.name),email=t(data.email).toLowerCase(),message=t(data.message),company=t(data.company);
  const interest=interests.includes(data.interest)?data.interest:'general';
  const budget=budgets.includes(data.budget)?data.budget as string:null;
  const timeline=timelines.includes(data.timeline)?data.timeline as string:null;
  if(name.length<2||name.length>100||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||company.length>150||message.length<20||message.length>5000||data.consent!=='on')return Response.json({error:'Please check your name, email, message, and consent.'},{status:400});
  const s=secrets();if(!s.FIREBASE_PROJECT_ID||!s.FIREBASE_CLIENT_EMAIL||!s.FIREBASE_PRIVATE_KEY){console.error('Firebase credentials missing');return Response.json({error:'Unable to save enquiry. Please try again.'},{status:503});}
  const id=crypto.randomUUID();
  const ip=request.headers.get('cf-connecting-ip')||request.headers.get('x-forwarded-for')||'unknown';
  const sourcePath=(()=>{try{return new URL(request.headers.get('referer')||'').pathname;}catch{return '/';}})();
  const fields={id:str(id),name:str(name),email:str(email),company:str(company||null),interest:str(interest),message:str(message),budget:str(budget),timeline:str(timeline),sourcePath:str(sourcePath),ipHash:str(await sha256(ip)),notifyStatus:str('pending'),createdAt:{integerValue:String(Date.now())}};
  const res=await fetch(`https://firestore.googleapis.com/v1/projects/${s.FIREBASE_PROJECT_ID}/databases/(default)/documents/enquiries?documentId=${id}`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${await accessToken(s)}`},body:JSON.stringify({fields})});
  if(!res.ok){console.error('Firestore write failed',res.status);return Response.json({error:'Unable to save enquiry. Please try again.'},{status:503});}
  return Response.json({ok:true},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(error){if(error instanceof SyntaxError)return Response.json({error:'Invalid request.'},{status:400});console.error('Contact submission unavailable');return Response.json({error:'Unable to save enquiry. Please try again.'},{status:503});}
}
