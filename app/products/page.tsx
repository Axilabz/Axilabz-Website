import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { products } from '@/lib/data/products';
import { PageHero, Section, CtaBand, Button, Headline, CheckList } from '@/components/site/ui';
import { ProductCard, AxiSolveCard } from '@/components/site/cards';

export const metadata: Metadata = pageMetadata({
  title: 'AI Products — AxiDoc, AxiCore and AxiData',
  description:
    'Explore AxiDoc (document extraction), AxiCore (AI application engineering) and AxiData (natural-language database queries), plus AxiSolve for custom AI and software solutions. AxiVoice is under research.',
  path: '/products',
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Products', href: '/products' }]}
        eyebrow="PRODUCTS"
        title={<Headline lead="Product pathways from the" accent="Axilabz Labz" />}
        intro="AxiDoc, AxiCore and AxiData address recurring problems in documents, AI engineering and data access. AxiVoice is under research. For anything else, AxiSolve is our custom-solution pathway."
        actions={<Button href="/contact" event="cta_click" location="products-hero">Talk to us</Button>}
      />
      <Section id="portfolio" title="Portfolio" intro="Cards for AxiDoc, AxiCore and AxiData link to a detailed page. AxiVoice is under research and has no page yet.">
        <div className="products-grid">
          {products.map((p) => <ProductCard key={p.slug} product={p} />)}
          <AxiSolveCard />
        </div>
      </Section>
      <Section id="how-to-read" tone="tint" title="How we describe product status" intro="So that you can tell a working capability from an intention.">
        <CheckList items={[
          'Available: released and usable today.',
          'In development: being built; scope and dates may change.',
          'Demonstration: shown in illustrative or prototype form only.',
          'Planned: intended, not yet started.',
          'Under research: being explored; not available and not open for enquiries.',
          'Confirmed on enquiry: we confirm the current position with you directly.',
        ]} />
      </Section>
      <CtaBand title="Which pathway fits your problem?" label="Start a conversation" location="products-bottom" />
    </>
  );
}
