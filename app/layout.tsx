import type { Metadata, Viewport } from 'next';
import './globals.css';
import './site.css';
import './moodboard.css';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { Analytics } from '@/components/site/Analytics';
import { HashScroll } from '@/components/site/HashScroll';
import { FloatingConsult } from '@/components/site/FloatingConsult';
import { JsonLd } from '@/components/site/JsonLd';
import { PageLoader } from '@/components/site/PageLoader';
import { SITE, siteOrigin } from '@/lib/site';
import { organizationLd, websiteLd } from '@/lib/seo';

const origin = siteOrigin();

export const metadata: Metadata = {
  ...(origin ? { metadataBase: new URL(origin) } : {}),
  title: { default: 'Axilabz — AI Engineering & Software Solutions', template: '%s | Axilabz' },
  description: SITE.description,
  applicationName: SITE.name,
  icons: { icon: [{ url: '/favicon-48.png', sizes: '48x48', type: 'image/png' }, { url: '/brand/axilabz-icon-256.png', sizes: '256x256', type: 'image/png' }], apple: '/brand/axilabz-icon-256.png' },
};

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/hanken-grotesk.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/bricolage-grotesque.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/instrument-serif-italic.woff2" as="font" type="font/woff2" crossOrigin="" />
        {/* Header background reacts to scrolling immediately, without waiting for the app bundle to hydrate. */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){var d=document.documentElement;function f(){if(window.scrollY>2){d.setAttribute('data-scrolled','')}else{d.removeAttribute('data-scrolled')}}f();window.addEventListener('scroll',f,{passive:true})})()" }} />
      </head>
      <body>
        <PageLoader />
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <Analytics />
        <HashScroll />
        <FloatingConsult />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </body>
    </html>
  );
}
