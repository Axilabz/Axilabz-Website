import Link from '@/components/site/Link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { industries } from '@/lib/data/industries';
import { serviceBySlug } from '@/lib/data/services';
import { PageHero, Section, CtaBand, Button, Headline, CheckList } from '@/components/site/ui';

export const metadata: Metadata = pageMetadata({
  title: 'Industries',
  description:
    'How AI and software solutions apply to financial services, healthcare, retail, manufacturing, logistics and professional services: challenges, applications and constraints.',
  path: '/industries',
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Industries', href: '/industries' }]}
        eyebrow="INDUSTRIES"
        title={<Headline lead="Applied to the way your sector" accent="really works" />}
        intro="Each industry has its own documents, regulations and risk tolerance. These are the challenges we see most often and the AI and software approaches that fit them."
        actions={<Button href="/contact?interest=ai-consulting" event="cta_click" location="industries-hero">Discuss your industry</Button>}
      />
      <Section id="industries" title="Industry applications" intro="We only describe applications that we can explain in practical terms. If your sector is not listed, the same engineering approach may still apply.">
        <nav aria-label="Industries on this page" style={{ marginBottom: 24 }}>
          <ul className="pill-list">
            {industries.map((i) => <li key={i.slug}><a href={`#${i.slug}`}>{i.name}</a></li>)}
          </ul>
        </nav>
        {industries.map((i) => (
          <article className="ind" id={i.slug} key={i.slug}>
            <div>
              <h2>{i.name}</h2>
              <p>{i.intro}</p>
              <h3 style={{ marginTop: 24 }}>Common challenges</h3>
              <CheckList items={i.challenges} />
            </div>
            <div>
              <h3>Relevant applications</h3>
              <div className="apps">
                {i.applications.map((a) => {
                  const svc = serviceBySlug(a.service);
                  return (
                    <div className="tile" key={a.title}>
                      <h3 style={{ textTransform: 'none', letterSpacing: '-.02em', fontFamily: 'Manrope, sans-serif', fontSize: 18, color: 'var(--navy)' }}>{a.title}</h3>
                      <p>{a.text}</p>
                      {svc && <p><Link href={`/services/${svc.slug}`} className="text-link">{svc.name}</Link></p>}
                    </div>
                  );
                })}
              </div>
              <p className="ind-note"><strong>Consideration:</strong> {i.considerations}</p>
            </div>
          </article>
        ))}
      </Section>
      <CtaBand title="Working in a regulated or document-heavy sector?" text="Tell us about your constraints first. They shape what is worth building." label="Discuss Your Project" location="industries-bottom" />
    </>
  );
}
