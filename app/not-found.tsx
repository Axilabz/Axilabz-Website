import type { Metadata } from 'next';
import Link from '@/components/site/Link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <section className="sec" aria-labelledby="nf-title">
      <div className="container" style={{ maxWidth: 720 }}>
        <p className="eyebrow"><span className="small-line" />404</p>
        <h1 id="nf-title" style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.05, margin: '20px 0' }}>
          This page <span style={{ color: 'var(--electric)' }}>could not be found<i style={{ color: 'var(--amber)', fontStyle: 'normal' }}>.</i></span>
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--muted)' }}>The link may be out of date. Try one of these instead.</p>
        <ul className="pill-list" style={{ marginTop: 24 }}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
        <p style={{ marginTop: 28 }}><Link className="button primary" href="/">Back to home <ArrowRight size={16} aria-hidden="true" /></Link></p>
      </div>
    </section>
  );
}
