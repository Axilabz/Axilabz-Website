import type { Metadata } from 'next';
import './globals.css';
import './brand.css';
import Preloader from './preloader';
export const metadata: Metadata = {title:'Axilabz — AI that works.',description:'AI engineering services and products. Start with a focused technical assessment, integration or implementation sprint with clear deliverables.',icons:{icon:[{url:'/favicon.png',type:'image/png'}],apple:'/brand/axilabz-icon.png'},openGraph:{title:'Axilabz',description:'From real problems to real possibilities. AI products and custom solutions.',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+Tamil:wght@400;600&display=block"/></head><body><Preloader/>{children}</body></html>}
