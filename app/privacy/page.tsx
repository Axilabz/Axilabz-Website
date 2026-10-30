import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { SITE } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How Axilabz collects, uses and protects the information you submit through this website.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="container">
      <Breadcrumbs trail={[{ name: 'Privacy Policy', href: '/privacy' }]} />
      <div className="legal">
        <h1 style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, letterSpacing: '-.03em' }}>Privacy Policy</h1>
        <p>This page describes what the Axilabz website collects and why. It covers the contact form and optional analytics.</p>

        <h2>Information you give us</h2>
        <p>When you send an enquiry we collect the name, business email address, optional company name, the topic you select, your message, and optional budget and timeline. We store these to read and answer your enquiry.</p>

        <h2>Information collected automatically</h2>
        <ul>
          <li>A one-way hash of your IP address, used only to limit repeated submissions and abuse. We do not store the address itself in the enquiry record.</li>
          <li>The page you were on when you submitted the form.</li>
          <li>Standard server logs kept by our hosting provider.</li>
        </ul>

        <h2>Analytics</h2>
        <p>If analytics is enabled on this site, it is switched off until you accept it in the banner, and you can decline. Declining has no effect on how you use the site.</p>

        <h2>Who sees your enquiry</h2>
        <p>Your enquiry is stored in a private database and sent by email to the Axilabz team through a transactional email provider so that we can respond. We do not sell your information.</p>

        <h2>Retention and your rights</h2>
        <p>We keep enquiries for as long as needed to respond and to keep a record of the conversation. You can ask us to access, correct or delete your information. {SITE.contact.email ? <>Email <a href={`mailto:${SITE.contact.email}`} style={{ textDecoration: 'underline' }}>{SITE.contact.email}</a>.</> : <>Send an enquiry through the contact form with the subject “Delete my data” and the email address you used.</>}</p>

        <h2>Security</h2>
        <p>Enquiries are held in an access-controlled database and are not exposed through any public page. No online system is perfectly secure, so please avoid sending sensitive personal data.</p>

        <h2>Changes</h2>
        <p>We may update this policy. The current version is always on this page.</p>
      </div>
    </div>
  );
}
