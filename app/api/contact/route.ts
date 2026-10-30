import { env } from 'cloudflare:workers';

const interestLabels: Record<string, string> = {
  'general': 'General enquiry / partnership',
  'custom-ai': 'Custom AI Solutions',
  'axivoice': 'AxiVoice',
  'axidoc': 'AxiDoc',
  'axicore': 'AxiCore',
  'engagement': 'Engagement / pilot',
};

const budgetLabels: Record<string, string> = {
  'under-5k': 'Under $5,000',
  '5k-15k': '$5,000 - $15,000',
  '15k-50k': '$15,000 - $50,000',
  '50k-plus': '$50,000+',
};

const timelineLabels: Record<string, string> = {
  'asap': 'Immediately / ASAP',
  '1-3-months': 'Within 1-3 months',
  '3-6-months': 'Within 3-6 months',
  'exploring': 'Exploring options',
};

type Secrets={
  FIREBASE_PROJECT_ID?:string;
  FIREBASE_CLIENT_EMAIL?:string;
  FIREBASE_PRIVATE_KEY?:string;
  RESEND_API_KEY?:string;
  CONTACT_FROM?:string;
  CONTACT_NOTIFY_TO?:string;
};
function secrets():Secrets{
  const e=env as unknown as Secrets;
  const p=typeof process!=='undefined'?process.env as Secrets:{};
  return{
    FIREBASE_PROJECT_ID:e.FIREBASE_PROJECT_ID||p.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL:e.FIREBASE_CLIENT_EMAIL||p.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY:e.FIREBASE_PRIVATE_KEY||p.FIREBASE_PRIVATE_KEY,
    RESEND_API_KEY:e.RESEND_API_KEY||p.RESEND_API_KEY,
    CONTACT_FROM:e.CONTACT_FROM||p.CONTACT_FROM,
    CONTACT_NOTIFY_TO:e.CONTACT_NOTIFY_TO||p.CONTACT_NOTIFY_TO,
  };
}
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
  const interest=Object.keys(interestLabels).includes(data.interest)?data.interest:'general';
  const budget=data.budget&&Object.keys(budgetLabels).includes(data.budget)?data.budget as string:null;
  const timeline=data.timeline&&Object.keys(timelineLabels).includes(data.timeline)?data.timeline as string:null;
  if(name.length<2||name.length>100||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||company.length>150||message.length<20||message.length>5000||data.consent!=='on')return Response.json({error:'Please check your name, email, message, and consent.'},{status:400});
  const s=secrets();if(!s.FIREBASE_PROJECT_ID||!s.FIREBASE_CLIENT_EMAIL||!s.FIREBASE_PRIVATE_KEY){console.error('Firebase credentials missing');return Response.json({error:'Unable to save enquiry. Please try again.'},{status:503});}
  const id=crypto.randomUUID();
  const ip=request.headers.get('cf-connecting-ip')||request.headers.get('x-forwarded-for')||'unknown';
  const sourcePath=(()=>{try{return new URL(request.headers.get('referer')||'').pathname;}catch{return '/';}})();
  const sourceLabel = sourcePath === '/' ? 'Homepage' : sourcePath;
  const displayInterest = interestLabels[interest] || interest;
  const displayBudget = budget ? (budgetLabels[budget] || budget) : 'Not specified';
  const displayTimeline = timeline ? (timelineLabels[timeline] || timeline) : 'Not specified';
  const displayCompany = company || 'Not specified';

  let notifyStatus = 'disabled';
  if (s.RESEND_API_KEY && s.CONTACT_NOTIFY_TO) {
    try {
      const from = s.CONTACT_FROM || 'onboarding@resend.dev';
      const to = s.CONTACT_NOTIFY_TO;
      const emailBody = [
        `A new enquiry has been submitted through axilabz.com.`,
        ``,
        `Enquiry Details:`,
        `• Name: ${name}`,
        `• Email: ${email}`,
        `• Company: ${displayCompany}`,
        `• Area of Interest: ${displayInterest}`,
        `• Budget: ${displayBudget}`,
        `• Expected Timeline: ${displayTimeline}`,
        `• Source Page: ${sourceLabel}`,
        ``,
        `Message:`,
        message,
        ``,
        `Please review the enquiry and follow up with the prospective client as appropriate.`,
        ``,
        `Best regards,`,
        name,
      ].join('\n');

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${s.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `[Axilabz] New Enquiry: ${name} (${displayInterest})`,
          text: emailBody,
        }),
      });

      if (resendRes.ok) {
        notifyStatus = 'sent';
      } else {
        const errText = await resendRes.text();
        console.error('Resend email failed:', resendRes.status, errText);
        notifyStatus = 'failed';
      }
    } catch (err) {
      console.error('Resend notification error:', err);
      notifyStatus = 'failed';
    }
  }

  const fields={id:str(id),name:str(name),email:str(email),company:str(company||null),interest:str(interest),message:str(message),budget:str(budget),timeline:str(timeline),sourcePath:str(sourcePath),ipHash:str(await sha256(ip)),notifyStatus:str(notifyStatus),createdAt:{integerValue:String(Date.now())}};
  const res=await fetch(`https://firestore.googleapis.com/v1/projects/${s.FIREBASE_PROJECT_ID}/databases/(default)/documents/enquiries?documentId=${id}`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${await accessToken(s)}`},body:JSON.stringify({fields})});
  if(!res.ok){console.error('Firestore write failed',res.status);return Response.json({error:'Unable to save enquiry. Please try again.'},{status:503});}
  return Response.json({ok:true},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(error){if(error instanceof SyntaxError)return Response.json({error:'Invalid request.'},{status:400});console.error('Contact submission unavailable');return Response.json({error:'Unable to save enquiry. Please try again.'},{status:503});}
}
