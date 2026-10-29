import Link from '@/components/site/Link';
import { Brand } from './Brand';
import { footerNav } from '@/lib/data/navigation';
import { SITE, formatAddress } from '@/lib/site';

export function Footer() {
  return (
    <footer className="gf">
      <div className="container gf-grid">
        <div className="gf-about">
          <Brand light />
          <p className="gf-blurb">AI engineering and software solutions: intelligent applications, workflow automation and scalable systems.</p>
          {formatAddress() && <p>{formatAddress()}</p>}
          {SITE.contact.phone && <p><a href={`tel:${SITE.contact.phone.replace(/[^+\d]/g, '')}`}>{SITE.contact.phone}</a></p>}
          <div className="gf-social">
            {SITE.contact.email && (
              <a href={`mailto:${SITE.contact.email}`} aria-label="Email Axilabz">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </a>
            )}
            <a href="https://www.instagram.com/axilabz" target="_blank" rel="noopener noreferrer" aria-label="Axilabz on Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/axilabz" target="_blank" rel="noopener noreferrer" aria-label="Axilabz on LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://x.com/Axilabz" target="_blank" rel="noopener noreferrer" aria-label="Axilabz on X">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
        {Object.entries(footerNav).map(([heading, links]) => (
          <nav key={heading} aria-label={`Footer: ${heading}`}>
            <h2>{heading}</h2>
            <ul>
              {links.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container gf-bottom">
        <span>© {new Date().getFullYear()} Axilabz. All rights reserved.</span>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
