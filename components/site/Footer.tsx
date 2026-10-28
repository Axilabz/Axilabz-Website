import Link from '@/components/site/Link';
import { Brand } from './Brand';
import { footerNav } from '@/lib/data/navigation';
import { SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="gf">
      <div className="container gf-grid">
        <div className="gf-about">
          <Brand light />
          <p className="gf-blurb">AI engineering and software solutions: intelligent applications, workflow automation and scalable systems.</p>
          {SITE.contact.email && <p><a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a></p>}
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
