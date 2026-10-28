import type { Metadata } from 'next';
import Link from '@/components/site/Link';
import { pageMetadata } from '@/lib/seo';
import { products } from '@/lib/data/products';
import { LabzChapter } from '@/components/home/Chapters';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { Section, CtaBand, CheckList } from '@/components/site/ui';
import { ProductCard, AxiSolveCard } from '@/components/site/cards';
import { WorkflowDiagram } from '@/components/diagrams/Diagrams';

export const metadata: Metadata = pageMetadata({
  title: 'Labz — Where Ideas Become What’s Next',
  description:
    'The Axilabz Labz: our AI product pathways AxiDoc, AxiCore and AxiData, AxiVoice (under research), and AxiSolve for custom builds, and how ideas move from experiment to product.',
  path: '/labz',
});

export default function LabzPage() {
  return (
    <>
      <div className="container"><Breadcrumbs trail={[{ name: 'Labz', href: '/labz' }]} /></div>
      <LabzChapter asH1 headingId="labz-page-title" />
      <Section id="portfolio" title="Inside the Labz" intro="The Labz is where Axilabz explores and packages recurring solutions. Status labels show what is confirmed and what is not.">
        <div className="products-grid">
          {products.map((p) => <ProductCard key={p.slug} product={p} />)}
          <AxiSolveCard />
        </div>
      </Section>
      <Section id="journey" tone="tint" title="From idea to product" intro="The path we follow when turning a recurring problem into a reusable product.">
        <WorkflowDiagram
          title="Labz journey"
          steps={[
            { label: 'Ideas', detail: 'Recurring problems noticed in client work' },
            { label: 'Experiments', detail: 'Small tests on real samples' },
            { label: 'Products', detail: 'Reusable, documented components' },
            { label: 'Real-world impact', detail: 'Measured against a baseline' },
          ]}
        />
      </Section>
      <Section id="status" title="Reading the status labels">
        <CheckList items={[
          'Available: released and usable today.',
          'In development: being built; scope and dates may change.',
          'Demonstration: an illustrative or prototype view only.',
          'Planned: intended but not started.',
          'Under research: being explored; not available and not open for enquiries.',
          'Confirmed on enquiry: we confirm the current position directly with you.',
        ]} />
        <p style={{ marginTop: 20 }}>Compare the products on the <Link href="/products" className="text-link">products page</Link>.</p>
      </Section>
      <CtaBand label="Talk to the Labz team" location="labz-bottom" />
    </>
  );
}
