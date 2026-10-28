import Link from '@/components/site/Link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { services, serviceBySlug } from '@/lib/data/services';
import { productBySlug } from '@/lib/data/products';
import { industryBySlug } from '@/lib/data/industries';
import { pageMetadata, serviceLd, faqLd } from '@/lib/seo';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHero, Section, Button, CheckList, FaqList, CtaBand, Tags, Headline } from '@/components/site/ui';
import { RelatedLink } from '@/components/site/cards';
import { Icon } from '@/components/site/Icon';
import { WorkflowDiagram } from '@/components/diagrams/Diagrams';

type Params = { slug: string };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return { title: 'Service not found', robots: { index: false } };
  return pageMetadata({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();

  const related = s.related.map((r) => serviceBySlug(r)).filter((x) => !!x);
  const prods = s.products.map((p) => productBySlug(p)).filter((x) => !!x && !x.underResearch);
  const inds = s.industries.map((i) => industryBySlug(i)).filter((x) => !!x);

  return (
    <>
      <PageHero
        trail={[{ name: 'Services', href: '/services' }, { name: s.name, href: `/services/${s.slug}` }]}
        eyebrow={s.name.toUpperCase()}
        title={<Headline accent={s.heroHeadline.replace(/\.$/, '')} />}
        intro={s.summary}
        actions={
          <>
            <Button href={`/contact?interest=${s.slug}`} event="service_conversion" location={`service:${s.slug}`}>{s.cta}</Button>
            <Link className="button secondary" href="#workflow">See an example workflow</Link>
          </>
        }
        aside={
          <div className="tile accent">
            <span className="tile-ic"><Icon name={s.icon} size={24} /></span>
            <h2 style={{ fontSize: 18 }}>The problem we address</h2>
            <p>{s.problem}</p>
            <Tags items={s.tags} />
          </div>
        }
      />

      <Section id="problem" title="The challenge" eyebrow="PROBLEM STATEMENT">
        <div className="prose">{s.problemStatement.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
      </Section>

      <Section id="use-cases" tone="tint" title="Business use cases" eyebrow="WHERE IT APPLIES">
        <div className="grid grid-2">
          {s.useCases.map((u) => (
            <article className="tile" key={u.title}><h3>{u.title}</h3><p>{u.text}</p></article>
          ))}
        </div>
      </Section>

      <Section id="capabilities" title="Key capabilities" eyebrow="WHAT WE BUILD">
        <div className="grid grid-3">
          {s.capabilities.map((c) => (
            <article className="tile accent" key={c.title}><h3>{c.title}</h3><p>{c.text}</p></article>
          ))}
        </div>
      </Section>

      <Section id="workflow" tone="tint" title="Example workflow" eyebrow="HOW IT WORKS" intro="A simplified view. The real design depends on your systems, data and risk requirements.">
        <WorkflowDiagram title={s.workflowTitle} steps={s.workflow} />
      </Section>

      <Section id="implementation" title="Implementation approach" eyebrow="WHAT IMPLEMENTATION INVOLVES">
        <div className="grid grid-2">
          {s.implementation.map((i, idx) => (
            <article className="tile" key={i.phase}>
              <h3><span style={{ color: 'var(--electric)' }}>{String(idx + 1).padStart(2, '0')}</span> {i.phase}</h3>
              <p>{i.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="integration" tone="tint" title="Integration considerations" eyebrow="TECHNICAL CONSIDERATIONS" intro="Typical systems this work connects to. The final list is confirmed during scoping.">
        <CheckList items={s.integrations} />
      </Section>

      <Section id="risks" title="Risks and limitations" eyebrow="BE REALISTIC" intro="No AI or software project is risk-free. These are the issues we plan for.">
        <div className="grid grid-2">
          {s.risks.map((r) => (
            <div className="risk" key={r.title}><h3>{r.title}</h3><p>{r.text}</p></div>
          ))}
        </div>
      </Section>

      <Section id="related" tone="tint" title="Related services, products and industries">
        <div className="grid grid-3">
          {related.map((r) => r && <RelatedLink key={r.slug} href={`/services/${r.slug}`} title={r.name} text={r.problem} />)}
          {prods.map((p) => p && <RelatedLink key={p.slug} href={`/products/${p.slug}`} title={`${p.name} product`} text={p.subtitle} />)}
          {inds.map((i) => i && <RelatedLink key={i.slug} href={`/industries#${i.slug}`} title={`${i.name} applications`} />)}
        </div>
      </Section>

      {s.faqs.length > 0 && (
        <Section id="faq" title="Frequently asked questions">
          <FaqList faqs={s.faqs} />
        </Section>
      )}

      <CtaBand title={s.cta} interest={s.slug} label="Discuss Your Project" location={`service-cta:${s.slug}`} />
      <JsonLd data={serviceLd(s)} />
      {s.faqs.length > 0 && <JsonLd data={faqLd(s.faqs)} />}
    </>
  );
}
