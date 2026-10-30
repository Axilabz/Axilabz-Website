'use client';

import { Bot, Check, Database, FileCheck2, Gauge, Layers, LayoutPanelTop, Plug, Rocket, ShieldCheck, Users, Wrench } from 'lucide-react';
import { useLoop } from './useLoop';

/**
 * Illustrative AxiCore workflow graphic that runs by itself in a loop. Engineers lead discovery; AxiCore
 * then supports design, implementation, validation and deployment, ending in a production-ready product.
 * Everything on screen is a pure function of the playhead. Fictional sample content, labelled as such.
 */

const DUR = 33000;
const HOLD = 2200;
const STILL = 31000;
const CUTS = [0, 6000, 12000, 18000, 24500, 29500, DUR] as const;
const STEPS = ['Discover', 'Design', 'Implement', 'Validate', 'Deploy'] as const;

const SCENES = [
  { title: 'Discover: engineers lead', text: 'Engineers work with your team to agree the goal, the users, the data and the constraints before anything is built.' },
  { title: 'Design with AxiCore', text: 'The brief becomes an architecture: data, retrieval, agents, tools and the guardrails around them.' },
  { title: 'Implement with AxiCore', text: 'Agents, retrieval and integrations are configured and wired to your systems, with permissions set from the start.' },
  { title: 'Validate with AxiCore', text: 'The solution is tested against an evaluation set, including safety and permission checks. Problems are fixed and re-tested.' },
  { title: 'Deploy with AxiCore', text: 'A staged release with tracing, cost limits and alerts, so quality can be watched after launch.' },
  { title: 'Production-ready product', text: 'A product that has been evaluated, secured, monitored and documented, built with AxiCore.' },
] as const;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const upTo = (p: number, n: number) => Math.min(n, Math.floor(p * (n + 0.99)));

function sceneAt(t: number) {
  let i = 0;
  for (let k = 0; k < CUTS.length - 1; k++) if (t >= CUTS[k]) i = k;
  return { i, p: clamp01((t - CUTS[i]) / (CUTS[i + 1] - CUTS[i])) };
}

const BRIEF = ['Goal: answer customer questions faster', 'Users: support team', 'Data: help articles, order system', 'Success measure: agreed baseline', 'Constraints: no data leaves region'];
const ARCH: { icon: typeof Database; label: string }[] = [
  { icon: Database, label: 'Your data' },
  { icon: Layers, label: 'Retrieval' },
  { icon: Bot, label: 'Agent' },
  { icon: Plug, label: 'Tools & APIs' },
  { icon: LayoutPanelTop, label: 'Interface' },
];
const CODE = ['agent: support-assistant', 'retrieval: help-articles', 'tools: [lookup_order, draft_reply]', 'permissions: read-only', 'guardrail: approval_before_send'];
const BUILD = ['Agent configured', 'Retrieval connected', 'Integrations wired', 'Tests generated'];
const EVALS = ['Answer quality', 'Tool use', 'Safety & permissions', 'Latency & cost'];
const ROLLOUT = ['Staging', 'Canary', 'Production'];
const READY = ['Evaluated', 'Secured', 'Monitored', 'Documented'];

export function AxiCoreDemo() {
  const { ref, t } = useLoop(DUR, HOLD, STILL);
  const { i, p } = sceneAt(t);
  const scene = SCENES[i];
  const active = Math.min(i, 4);

  return (
    <div className="dm" ref={ref} role="img" aria-label="Animated illustration of an engineering workflow: engineers lead discovery, then AxiCore supports design, implementation, validation and deployment, ending in a production-ready product. Fictional sample content. A text description follows.">
      <div className="dm-stage cd-stage">
        <div className="dm-bar"><i /><i /><i /><span>AxiCore · illustrative workflow · sample content</span></div>

        <div className="cd-body">
          <div className="cd-flow">
            <span className={`cd-bracket${i >= 1 ? ' on' : ''}`}><b>Built with AxiCore</b></span>
            <ol>
              {STEPS.map((s, n) => {
                const done = i === 5 || n < i;
                return (
                  <li key={s} className={`${n === active && i < 5 ? 'now' : ''}${done ? ' done' : ''}`}>
                    <span className="cd-dot">{done ? <Check size={13} /> : n + 1}</span>
                    <b>{s}</b>
                    {n === 0 && <small>Engineers</small>}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="cd-scene">
            {i === 0 && (
              <div className="cd-two">
                <div className="cd-team">
                  <div className="cd-people"><Users size={26} /><span>Engineers + your team</span></div>
                  {['Goals and users', 'Data and systems', 'Risks and constraints'].map((c, n) => (
                    <span key={c} className={`cd-chip${n < upTo(p, 3) ? ' on' : ''}`}>{c}</span>
                  ))}
                </div>
                <div className="cd-card">
                  <strong>Requirements brief</strong>
                  <ul>{BRIEF.map((l, n) => <li key={l} className={n < upTo(p, 5) ? 'on' : ''}>{l}</li>)}</ul>
                </div>
              </div>
            )}

            {i === 1 && (
              <div className="cd-arch">
                <div className="cd-arch-row">
                  {ARCH.map((a, n) => (
                    <div key={a.label} className={`cd-node${n < upTo(p, 5) ? ' on' : ''}`}><a.icon size={20} /><span>{a.label}</span></div>
                  ))}
                </div>
                <div className="cd-tags">
                  {['Permissions', 'Guardrails', 'Evaluation plan'].map((c, n) => <span key={c} className={`cd-chip${p > 0.6 + n * 0.12 ? ' on' : ''}`}>{c}</span>)}
                </div>
              </div>
            )}

            {i === 2 && (
              <div className="cd-two">
                <pre className="cd-code">{CODE.slice(0, upTo(p, 5)).join('\n')}</pre>
                <ul className="cd-list">
                  {BUILD.map((l, n) => <li key={l} className={n < upTo(p * 1.1, 4) ? 'on' : ''}>{n < upTo(p * 1.1, 4) ? <Check size={14} /> : <Wrench size={14} />}<span>{l}</span></li>)}
                </ul>
              </div>
            )}

            {i === 3 && (
              <ul className="cd-evals">
                {EVALS.map((l, n) => {
                  const start = n * 0.2;
                  const fill = clamp01((p - start) / 0.28);
                  const flagged = n === 2 && p > start + 0.2 && p < 0.72;
                  const passed = n === 2 ? p >= 0.72 : fill >= 1;
                  return (
                    <li key={l} className={flagged ? 'flag' : passed ? 'ok' : ''}>
                      <span>{l}{flagged ? ' · fix applied, re-testing' : ''}</span>
                      <div className="cd-bar"><i style={{ width: `${(flagged ? 0.55 : passed ? 1 : fill) * 100}%` }} /></div>
                      <em>{passed ? <Check size={14} /> : flagged ? '!' : ''}</em>
                    </li>
                  );
                })}
              </ul>
            )}

            {i === 4 && (
              <div className="cd-two">
                <div className="cd-rollout">
                  {ROLLOUT.map((r, n) => {
                    const prog = clamp01(p * 3 - n);
                    return <div key={r} className={prog >= 1 ? 'done' : prog > 0 ? 'now' : ''}><span>{r}</span><i style={{ width: `${prog * 100}%` }} /></div>;
                  })}
                </div>
                <div className="cd-tiles">
                  {[[Gauge, 'Tracing on'], [ShieldCheck, 'Cost limits'], [FileCheck2, 'Alerts set']].map(([Ic, l], n) => {
                    const Icon = Ic as typeof Gauge;
                    return <div key={String(l)} className={p > 0.35 + n * 0.15 ? 'on' : ''}><Icon size={18} /><span>{String(l)}</span></div>;
                  })}
                </div>
              </div>
            )}

            {i === 5 && (
              <div className="cd-ready">
                <span className="cd-rocket"><Rocket size={30} /></span>
                <strong>Product ready</strong>
                <small>Built with AxiCore</small>
                <ul>{READY.map((r, n) => <li key={r} className={n < upTo(p * 1.4, 4) ? 'on' : ''}><Check size={14} /> {r}</li>)}</ul>
              </div>
            )}
          </div>
        </div>

        <div className="dm-caption">
          <b>{scene.title}</b>
          <span>{scene.text}</span>
        </div>
      </div>

      <div className="sr-only">
        <p>Illustration using fictional sample content. It is not a recording of released functionality or a real customer.</p>
        <ol>{SCENES.map((s) => <li key={s.title}><strong>{s.title}.</strong> {s.text}</li>)}</ol>
      </div>
    </div>
  );
}
