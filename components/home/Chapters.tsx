import '@/app/chapters.css';
import '@/app/sections.css';
import { Icon, type IconName } from '@/components/site/Icon';
import { Eyebrow } from '@/components/site/ui';
import { TrackedLink } from '@/components/site/TrackedLink';
import { ArrowRight, Play } from 'lucide-react';
import Link from '@/components/site/Link';
import type { CSSProperties } from 'react';
import meta from '@/lib/art-meta.json';

/**
 * The A / X / I / Labz brand chapters. The graphics are the supplied high-resolution
 * designs (text, icons and cards are part of the images); headings, paragraphs, buttons
 * and the feature bars are live HTML. Built by scripts/build-art.mjs.
 */
export const ART = {
  hero: '/art/section-a.webp',
  x: '/art/section-x.webp',
  i: '/art/section-i.webp',
  labz: '/art/labz-hero.webp',
};

type Meta = { w: number; h: number; pl: number; pr: number; pt: number; pb: number; cw: number; ch: number; w1: number };
const M = meta as Record<string, Meta>;

/**
 * Each graphic is exported on a larger canvas with a soft halo that continues its edge colours and fades to
 * transparent (scripts/build-art.mjs). These CSS variables let the stylesheet size and offset the canvas so the
 * original picture stays exactly where the layout puts it while the halo melts into the section gradient.
 */
const artVars = (m: Meta): CSSProperties => ({
  ['--r' as string]: String(m.cw / m.w),
  ['--kl' as string]: String(m.pl / m.w),
  ['--kr' as string]: String(m.pr / m.w),
  ['--kt' as string]: String(m.pt / m.w),
  ['--kb' as string]: String(m.pb / m.w),
});

/** srcSet for a 1x/2x pair so high-DPI screens and browser zoom get the full-resolution file. */
export const srcSet = (src: string, m: Meta) => `${src} ${m.w1}w, ${src.replace('.webp', '-2x.webp')} ${m.cw}w`;
const SIZES = '(max-width: 1000px) 100vw, 56vw';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="eyebrow"><span className="small-line" />{children}</div>
);

const heroCapabilities: { icon: IconName; title: string; text: string; href: string }[] = [
  { icon: 'bot', title: 'AI Agents', text: 'Tool-using agents with guardrails', href: '/services/ai-agent-development' },
  { icon: 'file', title: 'Intelligent Document Processing', text: 'Extract, validate and route data', href: '/services/intelligent-document-processing' },
  { icon: 'brain', title: 'Generative AI & RAG', text: 'Answers grounded in your content', href: '/services/generative-ai-rag' },
  { icon: 'audio', title: 'Voice AI', text: 'Transcription and conversation tools', href: '/services/voice-ai' },
  { icon: 'workflow', title: 'Workflow Automation', text: 'Connect systems, remove hand-offs', href: '/services/workflow-automation' },
  { icon: 'cloud', title: 'AI Deployment & Operations', text: 'Release, monitor and improve', href: '/services/cloud-ai-deployment' },
];

type Feat = { icon: IconName; title: string; text: string };

function FeatureBar({ items, label }: { items: Feat[]; label: string }) {
  return (
    <ul className="cv2-feats" aria-label={label}>
      {items.map((f) => (
        <li key={f.title}>
          <Icon name={f.icon} size={28} />
          <div><strong>{f.title}</strong><span>{f.text}</span></div>
        </li>
      ))}
    </ul>
  );
}

/** A: hero. */
export function HeroChapter() {
  return (
    <section className="cv2 cv2-a" aria-labelledby="home-title">
      <div className="container cv2-grid">
        <div className="cv2-copy">
          <Eyebrow>AI ENGINEERING &amp; SOFTWARE SOLUTIONS</Eyebrow>
          <h1 id="home-title">
            <span className="sr-only">Axilabz: AI engineering and software solutions. </span>Build Smarter.<br />Operate Better.<br />
            <span>Scale with AI<i>.</i></span>
          </h1>
          <p>Axilabz helps businesses build intelligent applications, automate complex workflows, and develop scalable software solutions, from initial strategy and engineering to deployment and continuous improvement.</p>
          <div className="hero-actions">
            <TrackedLink className="button primary" href="/contact" event="cta_click" params={{ location: 'hero', label: 'discuss-your-project' }}>Discuss Your Project <ArrowRight size={16} aria-hidden="true" /></TrackedLink>
            <Link className="button secondary" href="/services"><Play size={14} fill="currentColor" aria-hidden="true" />Explore Our Capabilities</Link>
          </div>
        </div>
        {/* LCP image: a real prioritised <img> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cv2-art" src={ART.hero} srcSet={srcSet(ART.hero, M['section-a'])} sizes={SIZES} width={M['section-a'].cw} height={M['section-a'].ch} style={artVars(M['section-a'])} alt="" fetchPriority="high" decoding="async" />
      </div>
      <div className="container capabilities">
        <div className="capabilities-intro">
          <div className="eyebrow">OUR CAPABILITIES</div>
          <h2>End-to-end AI<br />for a smarter tomorrow.</h2>
          <span className="small-line" />
        </div>
        {heroCapabilities.map((c) => (
          <Link className="capability" href={c.href} key={c.title}>
            <Icon name={c.icon} size={28} />
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

const expertiseFeats: Feat[] = [
  { icon: 'users', title: 'Practical, not theoretical', text: 'Scoped around a measurable workflow' },
  { icon: 'shield', title: 'Human review by design', text: 'Approval steps where risk requires' },
  { icon: 'network', title: 'Enterprise integration', text: 'Built to fit existing systems' },
  { icon: 'chart', title: 'End-to-end partnership', text: 'Strategy through operation' },
];

/** X: expertise. */
export function ExpertiseChapter() {
  return (
    <section className="cv2 cv2-x" aria-labelledby="expertise-title">
      <div className="container cv2-grid">
        <div className="cv2-copy">
          <SectionLabel>EXCELLENCE</SectionLabel>
          <h2 id="expertise-title">Expertise<br />that connects<br /><span>everything<i>.</i></span></h2>
          <p>We bring AI engineering, software delivery and a clear view of your workflow together, so that what we build fits the way your business operates.</p>
          <Link className="button dark" href="/services">Explore Our Expertise <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cv2-art" src={ART.x} srcSet={srcSet(ART.x, M['section-x'])} sizes={SIZES} width={M['section-x'].cw} height={M['section-x'].ch} style={artVars(M['section-x'])} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="container"><FeatureBar items={expertiseFeats} label="How we work" /></div>
    </section>
  );
}

const innovationFeats: Feat[] = [
  { icon: 'lightbulb', title: 'Scoped pilots', text: 'Test the riskiest assumptions first' },
  { icon: 'box', title: 'Flexible & extensible', text: 'Adapt to your systems and data' },
  { icon: 'users', title: 'Built for collaboration', text: 'Co-create with your team' },
  { icon: 'chart', title: 'Measured value', text: 'Tracked against an agreed baseline' },
];

/** I: innovations. */
export function DeliveryChapter() {
  return (
    <section className="cv2 cv2-i" aria-labelledby="delivery-title">
      <div className="container cv2-grid">
        <div className="cv2-copy">
          <SectionLabel>INNOVATIONS</SectionLabel>
          <h2 id="delivery-title">Turning<br />innovations<br />into <span>impact<i>.</i></span></h2>
          <p>A seven-stage delivery lifecycle takes an idea from discovery to a monitored production system, with evaluation at every step.</p>
          <Link href="/approach" className="button dark">Explore Our Approach <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cv2-art" src={ART.i} srcSet={srcSet(ART.i, M['section-i'])} sizes={SIZES} width={M['section-i'].cw} height={M['section-i'].ch} style={artVars(M['section-i'])} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="container"><FeatureBar items={innovationFeats} label="What to expect" /></div>
    </section>
  );
}

/** Labz. */
export function LabzChapter({ headingId = 'labz-title', asH1 = false }: { headingId?: string; asH1?: boolean }) {
  const H = asH1 ? 'h1' : 'h2';
  return (
    <section className="labz-chapter" aria-labelledby={headingId} style={{ ['--labz-hvw' as string]: (60 * M['labz-hero'].ch) / M['labz-hero'].w } as CSSProperties}>
      <div className="container labz-hero">
        <div className="axi-copy">
          <SectionLabel>LABZ</SectionLabel>
          <H id={headingId}>Where ideas<br />become <span>what’s next<i>.</i></span></H>
          <p>We experiment, build and test AI products and solutions that address real operational challenges. Explore our product pathways, or talk to us about a custom build.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/products">Explore Our Products <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link className="button secondary" href="/contact?interest=axisolve">Discuss a Custom Solution</Link>
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="labz-art-wrap" src={ART.labz} srcSet={srcSet(ART.labz, M['labz-hero'])} sizes="(max-width: 600px) 112vw, 60vw" width={M['labz-hero'].cw} height={M['labz-hero'].ch} style={artVars(M['labz-hero'])} alt="" decoding="async" />
    </section>
  );
}
