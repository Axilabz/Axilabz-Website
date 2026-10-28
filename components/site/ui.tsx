import Link from '@/components/site/Link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import { TrackedLink } from './TrackedLink';
import { statusLabels, type CapabilityStatus } from '@/lib/data/products';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="small-line" />
      {children}
    </div>
  );
}

/** Heading with an electric-blue emphasised tail and the brand's amber full stop. */
export function Headline({ lead, accent }: { lead?: ReactNode; accent: ReactNode }) {
  return (
    <>
      {lead}{lead ? ' ' : ''}
      <span>{accent}<i>.</i></span>
    </>
  );
}

export function PageHero({
  eyebrow, title, intro, trail, actions, aside, tone = 'light',
}: {
  eyebrow: string; title: ReactNode; intro: ReactNode; trail?: Crumb[]; actions?: ReactNode; aside?: ReactNode; tone?: 'light' | 'dark';
}) {
  return (
    <section className={`ph ph-${tone}`}>
      <div className="container">
        {trail && <Breadcrumbs trail={trail} />}
        <div className={aside ? 'ph-grid has-aside' : 'ph-grid'}>
          <div className="ph-copy">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1>{title}</h1>
            <p className="ph-intro">{intro}</p>
            {actions && <div className="hero-actions">{actions}</div>}
          </div>
          {aside && <div className="ph-aside">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

export function Section({
  id, title, intro, children, tone = 'plain', eyebrow,
}: {
  id?: string; title?: ReactNode; intro?: ReactNode; children: ReactNode; tone?: 'plain' | 'tint' | 'navy'; eyebrow?: string;
}) {
  return (
    <section className={`sec sec-${tone}`} id={id} aria-labelledby={id && title ? `${id}-title` : undefined}>
      <div className="container">
        {(title || intro) && (
          <header className="sec-head">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <h2 id={id ? `${id}-title` : undefined}>{title}</h2>}
            {intro && <p>{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags" aria-label="Related capabilities">
      {items.map((t) => <li key={t}><span>{t}</span></li>)}
    </ul>
  );
}

export function StatusBadge({ status }: { status: CapabilityStatus }) {
  return <span className={`badge badge-${status}`}>{statusLabels[status]}</span>;
}

export function Button({
  href, children, variant = 'primary', event, location,
}: {
  href: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'dark'; event?: string; location?: string;
}) {
  const cls = `button ${variant}`;
  const inner = <>{children} <ArrowRight size={16} aria-hidden="true" /></>;
  return event
    ? <TrackedLink href={href} className={cls} event={event} params={{ location: location ?? '', label: typeof children === 'string' ? children : '' }}>{inner}</TrackedLink>
    : <Link href={href} className={cls}>{inner}</Link>;
}

export function CtaBand({
  title = 'Tell us what you are trying to solve.',
  text = 'Share a workflow, a document set or an idea. We will respond with practical next steps, not a sales script.',
  href = '/contact', label = 'Discuss Your Project', interest, location = 'cta-band',
}: { title?: string; text?: string; href?: string; label?: string; interest?: string; location?: string }) {
  const target = interest ? `${href}?interest=${interest}` : href;
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container cta-inner">
        <div>
          <h2 id="cta-title">{title}</h2>
          <p>{text}</p>
        </div>
        <Button href={target} event="cta_click" location={location}>{label}</Button>
      </div>
    </section>
  );
}

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {faqs.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="checks">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  );
}
