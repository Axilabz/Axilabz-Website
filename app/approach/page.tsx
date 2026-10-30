import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PageHero, Section, CtaBand, Button, Headline, CheckList } from '@/components/site/ui';
import { ApproachDemo } from '@/components/demo/ApproachDemo';
import { Icon } from '@/components/site/Icon';
import '@/app/demo.css';

export const metadata: Metadata = pageMetadata({
  title: 'Our Approach — From Discovery to Continuous Improvement',
  description:
    'Axilabz engineers work closely with your business to discover and define the solution, build it on AxiCore, validate and deploy it, then hand it over to your team.',
  path: '/approach',
});

export default function ApproachPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Our Approach', href: '/approach' }]}
        eyebrow="OUR APPROACH"
        title={<Headline lead="A delivery lifecycle built on" accent="evidence" />}
        intro="AI projects fail when assumptions are not tested. Our lifecycle makes the riskiest assumptions visible early and keeps measuring after launch."
        actions={<Button href="/contact" event="cta_click" location="approach-hero">Plan a project with us</Button>}
      />
      <Section id="strength" eyebrow="OUR STRENGTH" title="Engineers close to you, built on AxiCore, handed over to your team" intro="Three things set how we deliver. Each is explained below and shown in the walkthrough that follows.">
        <div className="grid grid-3">
          {[
            { icon: 'users', title: 'Discovery with engineers', text: 'Our engineers work closely with your business team and your users from the first week. They learn how the work is really done, then define the solution together with you, including the scope, the success measure and the boundaries.' },
            { icon: 'core', title: 'Built on AxiCore', text: 'Once the solution is defined, we build it on AxiCore, our engineering foundation for agents, retrieval, integrations, evaluation and deployment. Work starts from a consistent base, with tests, reviews and security checks along the way.' },
            { icon: 'check', title: 'A clean handover', text: 'We finish by handing the solution over: documentation, runbooks, training and access. Your team understands what was built, can run it and can change it without depending on us.' },
          ].map((v) => (
            <article className="tile accent" key={v.title}>
              <Icon name={v.icon as 'users'} size={26} />
              <h3 style={{ marginTop: 12 }}>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section id="walkthrough" tone="tint" eyebrow="DEMO" title="See how a project runs" intro="From discovery with your team to handover. Fictional sample content, shown as an illustration of how we work.">
        <ApproachDemo />
      </Section>
      <Section id="principles" eyebrow="PRINCIPLES" title="How we make decisions" >
        <div className="two-col">
          <div className="prose">
            <p>Every engagement is built around a measurable workflow, a baseline and an evaluation set. We prefer a narrow pilot that can be judged over a broad platform that cannot.</p>
            <p>Where a deterministic workflow is enough, we recommend it. AI is used where interpretation or language is genuinely needed.</p>
          </div>
          <CheckList items={[
            'Start with the workflow and the people who run it.',
            'Agree success measures and a baseline before building.',
            'Test on real, representative cases, including the awkward ones.',
            'Keep people in the loop where mistakes are costly.',
            'Instrument everything so quality, cost and usage are visible.',
            'Document the system so your team can own it.',
          ]} />
        </div>
      </Section>
      <CtaBand title="Start with a discovery conversation" text="We will help you decide whether, and how, to proceed. A clear 'not yet' is a useful answer." label="Book a Free Strategy Call" location="approach-bottom" />
    </>
  );
}
