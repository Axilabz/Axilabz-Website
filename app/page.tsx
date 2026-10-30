import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { products } from '@/lib/data/products';
import meta from '@/lib/art-meta.json';
import { HeroChapter, ExpertiseChapter, DeliveryChapter, LabzChapter, ART } from '@/components/home/Chapters';
import { ProductCard, AxiSolveCard } from '@/components/site/cards';
import { CtaBand, Section } from '@/components/site/ui';
import { Icon } from '@/components/site/Icon';

export const metadata: Metadata = pageMetadata({
  title: 'Axilabz — AI Engineering & Software Solutions',
  absoluteTitle: true,
  description:
    'Axilabz (also written Axilabs) helps businesses build intelligent applications, automate complex workflows and develop scalable software, from strategy and engineering to deployment and improvement.',
  path: '/',
});

const proof = [
  { title: 'Engineering-led', text: 'AI features are built as maintainable software with tests, review and documentation, not as one-off demos.' },
  { title: 'Measured, not assumed', text: 'We agree a baseline and an evaluation set first, so results are compared with how the process performs today.' },
  { title: 'Human oversight by design', text: 'Approval steps, escalation paths and audit trails are designed in where the risk requires them.' },
  { title: 'Transparent about limits', text: 'Every service page lists risks and limitations. If a use case is not ready, we say so.' },
];

const stack = [
  { title: 'Models & retrieval', text: 'Language, speech and embedding models; hybrid search; prompt and evaluation tooling.' },
  { title: 'Data & integration', text: 'Pipelines, APIs, queues and connectors to ERP, CRM and document systems.' },
  { title: 'Application engineering', text: 'React and TypeScript front ends, typed back-end services, accessible interfaces.' },
  { title: 'Deployment & operations', text: 'Cloud and edge deployment, tracing, cost control and release pipelines.' },
];

export default function HomePage() {
  return (
    <>
      {/* Hint the browser to fetch the hero artwork (the LCP element) early. */}
      <link rel="preload" as="image" href={ART.hero} imageSrcSet={`${ART.hero} ${meta["section-a"].w1}w, /art/section-a-2x.webp ${meta["section-a"].cw}w`} imageSizes="(max-width: 1000px) 100vw, 56vw" type="image/webp" fetchPriority="high" />

      <HeroChapter />

      {/* A → X → I → Labz: one continuous brand flow */}
      <ExpertiseChapter />

      <DeliveryChapter />


      <LabzChapter />
      <Section id="products" tone="plain" eyebrow="PRODUCT PORTFOLIO" title="Product pathways" intro="AxiDoc, AxiCore and AxiData are product pathways; availability and scope are confirmed when you enquire. AxiVoice is under research.">
        <div className="products-grid">
          {products.map((p) => <ProductCard key={p.slug} product={p} />)}
          <AxiSolveCard />
        </div>
      </Section>

      <Section
        id="why"
        tone="tint"
        eyebrow="HOW WE WORK"
        title="What you can expect from working with Axilabz"
        intro="We prefer to earn trust through method and transparency. Reference projects and metrics will be published here once they can be substantiated."
      >
        <div className="proof">
          {proof.map((p) => (
            <div key={p.title}><h3>{p.title}</h3><p>{p.text}</p></div>
          ))}
        </div>
      </Section>

      <Section id="technology" tone="navy" eyebrow="ENGINEERING & TECHNOLOGY" title="Capabilities across the stack" intro="Technology choices follow the problem, your constraints and your team, not the other way round.">
        <div className="stack">
          {stack.map((s) => (
            <div key={s.title}><Icon name="check" size={20} /><h3>{s.title}</h3><p>{s.text}</p></div>
          ))}
        </div>
      </Section>

      <CtaBand location="home-bottom" />
    </>
  );
}
