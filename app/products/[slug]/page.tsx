import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { linkableProducts, productBySlug } from '@/lib/data/products';
import { serviceBySlug } from '@/lib/data/services';
import { pageMetadata, productLd, faqLd } from '@/lib/seo';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHero, Section, Button, CheckList, FaqList, CtaBand, Tags, StatusBadge, Headline } from '@/components/site/ui';
import { RelatedLink } from '@/components/site/cards';
import { ProductMock } from '@/components/diagrams/Diagrams';
import Link from '@/components/site/Link';
import '@/app/demo.css';
import { AxiDocDemo } from '@/components/demo/AxiDocDemo';
import { AxiCoreDemo } from '@/components/demo/AxiCoreDemo';
import { AxiDataDemo } from '@/components/demo/AxiDataDemo';

type Params = { slug: string };

export function generateStaticParams() {
  return linkableProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p || p.underResearch) return { title: 'Product not found', robots: { index: false } };
  return pageMetadata({ title: p.metaTitle, description: p.metaDescription, path: `/products/${p.slug}` });
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p || p.underResearch) notFound();
  const hasDemo = p.slug === 'axidoc' || p.slug === 'axicore' || p.slug === 'axidata';
  const svcs = p.services.map((s) => serviceBySlug(s)).filter((x) => !!x);

  return (
    <>
      <PageHero
        trail={[{ name: 'Products', href: '/products' }, { name: p.name, href: `/products/${p.slug}` }]}
        eyebrow={`${p.name.toUpperCase()} · ${p.subtitle.toUpperCase()}`}
        title={<Headline accent={p.heroHeadline.replace(/\.$/, '')} />}
        intro={p.summary}
        actions={
          <>
            <Button href={`/contact?interest=${p.interest}`} event="product_enquiry_click" location={`product:${p.slug}`}>Enquire about {p.name}</Button>
            <Link className="button secondary" href={hasDemo ? '#demo' : '#capabilities'}>{hasDemo ? 'See how it works' : 'View capabilities'}</Link>
          </>
        }
        aside={<ProductMock title={p.mock.title} rows={p.mock.rows} name={p.name} />}
      />

      {p.slug === 'axidoc' && (
        <Section id="demo" eyebrow="DEMO" title="See AxiDoc in action" intro="An invoice moving from upload to clean, reviewed data. Fictional sample data, shown as an illustration of the intended workflow.">
          <AxiDocDemo />
        </Section>
      )}

      {p.slug === 'axicore' && (
        <Section id="demo" eyebrow="DEMO" title="See how AxiCore fits the engineering workflow" intro="Engineers lead discovery, then AxiCore supports design, implementation, validation and deployment. Fictional sample content, shown as an illustration of the intended workflow.">
          <AxiCoreDemo />
        </Section>
      )}

      {p.slug === 'axidata' && (
        <Section id="demo" eyebrow="DEMO" title="See AxiData in action" intro="A plain-English question turned into reviewable SQL and a result. Fictional sample data, shown as an illustration of the intended workflow.">
          <AxiDataDemo />
        </Section>
      )}

      <Section id="problem" eyebrow="THE PROBLEM" title="Why it matters">
        <div className="prose">{p.problem.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}</div>
      </Section>

      <Section id="capabilities" tone="tint" eyebrow="CAPABILITIES" title={`What ${p.name} is designed to do`}>
        <div className="grid grid-3">
          {p.capabilities.map((c) => (
            <article className="tile accent" key={c.title}>
              <StatusBadge status={c.status} />
              <h3 style={{ marginTop: 12 }}>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="use-cases" eyebrow="USE CASES" title="Where it fits">
        <div className="grid grid-3">
          {p.useCases.map((u) => <article className="tile" key={u.title}><h3>{u.title}</h3><p>{u.text}</p></article>)}
        </div>
        <Tags items={p.tags} />
      </Section>

      <Section id="considerations" tone="tint" eyebrow="TECHNICAL CONSIDERATIONS" title="What to plan for">
        <CheckList items={p.considerations} />
      </Section>

      <Section id="related" tone="tint" title="Related services">
        <div className="grid grid-3">
          {svcs.map((s) => s && <RelatedLink key={s.slug} href={`/services/${s.slug}`} title={s.name} text={s.problem} />)}
          <RelatedLink href="/products" title="All products" text="Compare AxiDoc, AxiCore and AxiData" />
        </div>
      </Section>

      <Section id="faq" title="Frequently asked questions"><FaqList faqs={p.faqs} /></Section>

      <CtaBand title={`Talk to us about ${p.name}`} text="Tell us about your use case. We will confirm availability, scope and a sensible first step." interest={p.interest} label={`Enquire about ${p.name}`} location={`product-cta:${p.slug}`} />
      <JsonLd data={productLd(p)} />
      <JsonLd data={faqLd(p.faqs)} />
    </>
  );
}
