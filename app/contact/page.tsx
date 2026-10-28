import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { Eyebrow } from '@/components/site/ui';
import { ContactForm } from '@/components/contact/ContactForm';
import { SITE } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Contact — Discuss Your Project',
  description:
    'Tell Axilabz about your AI or software project. Share the workflow, documents or idea, and we will respond with practical next steps.',
  path: '/contact',
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = sp.interest;
  const interest = typeof raw === 'string' ? raw : 'general';

  return (
    <div className="container">
      <Breadcrumbs trail={[{ name: 'Contact', href: '/contact' }]} />
      <div className="contact-page">
        <div className="contact-copy">
          <Eyebrow>LET’S CONNECT</Eyebrow>
          <h1 style={{ fontSize: 'clamp(36px,4.2vw,58px)', fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.08, margin: '20px 0' }}>
            Big idea? Real challenge? <span style={{ color: 'var(--electric)' }}>Start here<i style={{ color: 'var(--amber)', fontStyle: 'normal' }}>.</i></span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 480 }}>
            Tell us what you are working on. Whether you are exploring a product or need a solution built from the ground up, we would like to hear it.
          </p>
          <ul className="contact-points">
            <li>Only name, email and message are required. Everything else helps us route your enquiry.</li>
            <li>We read every enquiry. Please do not include passwords or sensitive personal data.</li>
            <li>Your details are used to respond to you. See our privacy policy for how they are handled.</li>
            {SITE.contact.email && <li>Prefer email? <a href={`mailto:${SITE.contact.email}`} style={{ textDecoration: 'underline' }}>{SITE.contact.email}</a></li>}
          </ul>
        </div>
        <ContactForm initialInterest={interest} />
      </div>
    </div>
  );
}
