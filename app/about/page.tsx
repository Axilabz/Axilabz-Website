import type { Metadata } from 'next';
import Link from '@/components/site/Link';
import { pageMetadata } from '@/lib/seo';
import { PageHero, Section, CtaBand, Button, Headline } from '@/components/site/ui';
import { Icon } from '@/components/site/Icon';

export const metadata: Metadata = pageMetadata({
  title: 'About Axilabz',
  description:
    'Axilabz is an AI engineering and software solutions company building intelligent applications, automating workflows and developing scalable systems. Accelerating Xcellence Innovation.',
  path: '/about',
});

const values = [
  { icon: 'check', title: 'Practical before impressive', text: 'We choose the simplest design that solves the problem, and we say so when a deterministic workflow beats an AI agent.' },
  { icon: 'shield', title: 'Honest about limits', text: 'Every capability has constraints. We describe them upfront, on this website and in proposals.' },
  { icon: 'layers', title: 'Engineering discipline', text: 'Tests, reviews, documentation and observability apply to AI work just as they do to any production system.' },
  { icon: 'users', title: 'Your team stays in control', text: 'We design for handover, with systems your people can understand, operate and change.' },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'About', href: '/about' }]}
        eyebrow="ABOUT AXILABZ"
        title={<Headline lead="AI engineering for" accent="real operations" />}
        intro="Axilabz helps businesses build intelligent applications, automate complex workflows and develop scalable software. Our tagline is our working principle: accelerating excellent innovations."
        actions={<Button href="/contact" event="cta_click" location="about-hero">Talk to us</Button>}
      />

      <Section id="what" title="What we do" eyebrow="COMPANY">
        <div className="two-col">
          <div className="prose">
            <p>We are an AI engineering and software solutions company. Our work spans strategy and feasibility, AI agents and retrieval systems, document and voice intelligence, custom software and web applications, data engineering, workflow automation, and the deployment and monitoring needed to keep AI systems reliable.</p>
            <p>We also develop product pathways in the Labz: AxiDoc for document extraction, AxiCore for AI application engineering and AxiData for asking questions of your data, with AxiSolve for custom solutions.</p>
          </div>
          <div className="grid grid-2">
            <Link href="/services" className="related"><span><strong>Services</strong><small>AI and software engineering</small></span></Link>
            <Link href="/products" className="related"><span><strong>Products</strong><small>AxiDoc, AxiCore, AxiData and more</small></span></Link>
            <Link href="/approach" className="related"><span><strong>Our approach</strong><small>A seven-stage lifecycle</small></span></Link>
          </div>
        </div>
      </Section>

      <Section id="values" tone="tint" title="How we work" eyebrow="PRINCIPLES">
        <div className="grid grid-4">
          {values.map((v) => (
            <article className="tile accent" key={v.title}>
              <span className="tile-ic"><Icon name={v.icon} size={22} /></span>
              <h3>{v.title}</h3><p>{v.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="brand" title="A, X, I and Labz" eyebrow="OUR BRAND" intro="The Axilabz identity is built from four chapters.">
        <div className="grid grid-4">
          {[
            ['A', 'Idea to impact', 'Where every project starts: a real business problem.'],
            ['X', 'Excellence', 'Where AI engineering, software and domain context connect.'],
            ['I', 'Innovation', 'Where tested ideas become production systems.'],
            ['Labz', 'Where ideas become what’s next', 'Our products and experiments.'],
          ].map(([k, t, d]) => (
            <article className="tile" key={k}><h3 style={{ fontSize: 28, color: 'var(--electric)' }}>{k}</h3><p><strong>{t}.</strong> {d}</p></article>
          ))}
        </div>
      </Section>

      <CtaBand label="Start a conversation" location="about-bottom" />
    </>
  );
}
