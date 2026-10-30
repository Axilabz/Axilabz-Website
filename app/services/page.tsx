import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { serviceBySlug, serviceGroups } from '@/lib/data/services';
import { PageHero, Section, Button, CtaBand, Headline } from '@/components/site/ui';
import { ServiceCard } from '@/components/site/cards';
import { DataFlow, Chips } from '@/components/diagrams/Graphics';

export const metadata: Metadata = pageMetadata({
  title: 'AI & Software Services',
  description:
    'AI and software engineering services: consulting, AI agents, RAG, document processing, voice AI, custom software, web apps, data engineering, automation and deployment.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Services', href: '/services' }]}
        eyebrow="SERVICES"
        title={<Headline lead="AI and software engineering," accent="end to end" />}
        intro="Choose a starting point by the problem you have. Each service page explains the challenge, the use cases, how we implement it and what to watch out for."
        actions={<Button href="/contact" event="cta_click" location="services-hero">Discuss Your Project</Button>}
        aside={<div className="flat-panel"><DataFlow /><Chips items={[{ label: 'Products', href: '/products' }, { label: 'AI implementation', href: '#all-services' }, { label: 'Build services', href: '/services/custom-software-development' }]} /></div>}
      />
      <Section id="all-services" title="Our services" intro="Services are designed to work together: many projects combine strategy, a data foundation, an AI capability and a deployed application.">
        {serviceGroups.map((g) => (
          <div className="svc-group" key={g.slug} id={g.slug}>
            <header className="svc-group-head">
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </header>
            <div className={g.services.length === 1 ? 'svc-grid one' : g.services.length === 3 ? 'svc-grid three' : 'svc-grid'}>
              {g.services.flatMap((slug) => { const s = serviceBySlug(slug); return s ? [<ServiceCard key={s.slug} service={s} />] : []; })}
            </div>
          </div>
        ))}
      </Section>
      <CtaBand title="Not sure which service fits?" text="Describe the outcome you want. We will suggest a sensible starting point, which is sometimes a small feasibility test rather than a build." label="Book a Free Strategy Call" location="services-bottom" />
    </>
  );
}
