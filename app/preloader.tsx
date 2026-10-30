'use client';
import {useEffect,useState} from 'react';
export default function Preloader(){const [done,setDone]=useState(false);const [gone,setGone]=useState(false);
useEffect(()=>{const min=Date.now()+900;const finish=()=>setTimeout(()=>setDone(true),Math.max(0,min-Date.now()));if(document.readyState==='complete')finish();else window.addEventListener('load',finish,{once:true});const t=setTimeout(()=>setDone(true),5000);return()=>clearTimeout(t);},[]);
useEffect(()=>{if(!done)return;const t=setTimeout(()=>setGone(true),700);return()=>clearTimeout(t);},[done]);
if(gone)return null;
return <div className={'preloader'+(done?' done':'')} role="status" aria-label="Loading Axilabz"><div className="pl-stage"><span className="pl-ring"/><span className="pl-ring r2"/><img className="pl-logo" src="/brand/axilabz-icon.png" alt="" width="120" height="120"/></div></div>}
