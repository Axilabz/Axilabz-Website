import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PageHero, Section, Button, CtaBand, Headline, CheckList } from '@/components/site/ui';
import { Icon } from '@/components/site/Icon';
import { SITE } from '@/lib/site';

/** Opens the visitor's mail app with the recipient, subject and a short template already filled in. */
const applyBody = ["Hello Axilabz team,","","I would like to apply for the Forward Deployed Engineer role.","","Name:","Current role and company:","Link to my work (GitHub, portfolio or LinkedIn):","","A few lines about what I have built and why this role interests me:",""].join('\r\n');
const applyHref = `mailto:${SITE.careersEmail}?subject=${encodeURIComponent('Application: Forward Deployed Engineer')}&body=${encodeURIComponent(applyBody)}`;

export const metadata: Metadata = pageMetadata({
  title: 'Careers: Forward Deployed Engineer',
  description:
    'Join Axilabz as a Forward Deployed Engineer: work directly with customers to design, build and deploy AI and software solutions that run in real operations.',
  path: '/careers',
});

const responsibilities = [
  'Work with customer teams to understand their workflow, data and constraints, and turn them into a clear, buildable scope.',
  'Design and build AI and software solutions end to end: agents, retrieval, document and data pipelines, integrations and web applications.',
  'Deploy into the customer’s environment, then monitor, evaluate and improve the solution after launch.',
  'Test properly: write evaluation sets, measure accuracy and safety, and report results honestly, including the limits.',
  'Document what you build and hand it over so the customer’s team can run and change it.',
  'Feed what you learn in the field back into our products and services in the Labz.',
];

const skills = [
  'Strong software engineering in Python or TypeScript, with solid fundamentals in APIs, databases and testing.',
  'Hands-on experience building with large language models, such as prompting, retrieval, tool use or evaluation.',
  'Comfort with cloud deployment, logging and monitoring, and with debugging in unfamiliar environments.',
  'Clear written and spoken communication with both technical and non-technical people.',
  'Ownership: you take a problem from vague request to working, deployed solution.',
];

const nice = [
  'Experience with SQL, data engineering or analytics tooling.',
  'Experience with document processing, voice or workflow automation.',
  'Prior customer-facing, consulting or solutions engineering work.',
];

const steps = [
  { title: 'Apply', text: 'Tell us about yourself and what you have built. A link to your work is welcome.' },
  { title: 'Conversation', text: 'A first call about your experience and what you want to work on.' },
  { title: 'Practical exercise', text: 'A small, realistic problem that reflects the work, discussed together.' },
  { title: 'Decision', text: 'We share the outcome and next steps clearly, whatever it is.' },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        trail={[{ name: 'Careers', href: '/careers' }]}
        eyebrow="CAREERS"
        title={<Headline lead="Build AI that runs in" accent="real operations" />}
        intro="We are looking for engineers who like working close to the customer. The Forward Deployed Engineer role sits between engineering and the people who use what we build."
        actions={<Button href={applyHref} event="cta_click" location="careers-hero">Apply for this role</Button>}
      />

      <Section id="role" eyebrow="OPEN ROLE" title="Forward Deployed Engineer" intro="You will be embedded with customer teams, building and deploying solutions where the work actually happens, with the support of the wider Axilabz engineering team.">
        <div className="two-col">
          <div>
            <h3 className="careers-h">What you will do</h3>
            <CheckList items={responsibilities} />
          </div>
          <div>
            <h3 className="careers-h">What we look for</h3>
            <CheckList items={skills} />
            <h3 className="careers-h">Helpful, not required</h3>
            <CheckList items={nice} />
          </div>
        </div>
      </Section>

      <Section id="how-we-work" tone="tint" eyebrow="HOW WE WORK" title="What the work is like">
        <div className="grid grid-2">
          {[
            { icon: 'users', title: 'Close to the customer', text: 'You work directly with the people who use the solution, not through layers of hand-offs.' },
            { icon: 'shield', title: 'Honest engineering', text: 'We measure, report limits and say when a simpler approach is better than AI.' },
            { icon: 'layers', title: 'End to end', text: 'From discovery to deployment and monitoring, you see the whole path to production.' },
            { icon: 'flask', title: 'Connected to the Labz', text: 'What you learn in the field shapes the products we build.' },
          ].map((v) => (
            <article className="tile accent" key={v.title}>
              <Icon name={v.icon as 'users'} size={26} />
              <h3 style={{ marginTop: 12 }}>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="process" eyebrow="HIRING PROCESS" title="What to expect">
        <ol className="careers-steps">
          {steps.map((s, n) => (
            <li key={s.title}><span>{n + 1}</span><div><strong>{s.title}</strong><p>{s.text}</p></div></li>
          ))}
        </ol>
        <p className="careers-note">Location, working arrangements and compensation are discussed during the process.</p>
      </Section>

      <CtaBand title="Interested in the Forward Deployed Engineer role?" text="Send us a short note about your background and the kind of work you want to do." label="Apply for this role" href={applyHref} location="careers-bottom" />
    </>
  );
}
