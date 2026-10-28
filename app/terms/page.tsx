import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Use',
  description: 'Terms for using the Axilabz website.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="container">
      <Breadcrumbs trail={[{ name: 'Terms of Use', href: '/terms' }]} />
      <div className="legal">
        <h1 style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, letterSpacing: '-.03em' }}>Terms of Use</h1>
        <p>By using this website you agree to these terms.</p>
        <h2>Information on this site</h2>
        <p>Content is provided for general information about Axilabz and its services. Product and service descriptions are not offers, and availability and scope are confirmed in writing before any engagement.</p>
        <h2>Acceptable use</h2>
        <p>Do not misuse the site, attempt to disrupt it, or submit unlawful, abusive or automated content through the contact form.</p>
        <h2>Intellectual property</h2>
        <p>The Axilabz name, logo and artwork are the property of Axilabz. Please do not reproduce them without permission.</p>
        <h2>Liability</h2>
        <p>The site is provided as is. To the extent permitted by law, Axilabz is not liable for losses arising from use of the site.</p>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent through the contact page.</p>
      </div>
    </div>
  );
}
