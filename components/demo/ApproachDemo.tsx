'use client';

import { Bot, BookOpen, Check, ClipboardList, GraduationCap, KeyRound, Layers, LifeBuoy, Plug, ShieldCheck, Users } from 'lucide-react';
import { useLoop } from './useLoop';

/**
 * Illustrative walkthrough of how Axilabz delivers: engineers work closely with the business and the client
 * to define the solution, build it on AxiCore, validate and deploy it, then hand it over. Runs by itself in
 * a loop. Everything on screen is a pure function of the playhead. Fictional sample content.
 */

const DUR = 42000;
const HOLD = 2400;
const STILL = 40000;
const CUTS = [0, 7000, 14000, 21000, 27000, 33000, DUR] as const;
const STEPS = ['Discover', 'Define', 'Build', 'Validate', 'Deploy', 'Handover'] as const;

const SCENES = [
  { title: 'Discover: engineers work closely with you', text: 'Our engineers sit with your business team and your users to understand the goal, the current process, the pain points and the constraints.' },
  { title: 'Define the solution together', text: 'Scope, success measure, baseline and boundaries are agreed with you before building starts, including what will not be automated.' },
  { title: 'Build on AxiCore', text: 'The solution is built on AxiCore: agents, retrieval, integrations and guardrails, with tests and reviews as it is built.' },
  { title: 'Validate against your cases', text: 'It is tested on realistic cases, including awkward ones, and measured against the agreed baseline. Issues are fixed and re-tested.' },
  { title: 'Deploy in stages', text: 'A staged release with monitoring, cost limits and alerts, so quality can be watched from the first day.' },
  { title: 'Hand over to your team', text: 'Documentation, runbooks, training and access are handed over, so your team understands, runs and can change what was built.' },
] as const;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const upTo = (p: number, n: number) => Math.min(n, Math.floor(p * (n + 0.99)));

function sceneAt(t: number) {
  let i = 0;
  for (let k = 0; k < CUTS.length - 1; k++) if (t >= CUTS[k]) i = k;
  return { i, p: clamp01((t - CUTS[i]) / (CUTS[i + 1] - CUTS[i])) };
}

const PEOPLE = ['Our engineers', 'Your business team', 'Your users'];
const LEARN = ['The goal and who it is for', 'How the work is done today', 'Where time and quality are lost', 'Systems, data and constraints'];
const BRIEF = ['Scope: one workflow, end to end', 'Success measure and baseline agreed', 'Boundaries: what stays with people', 'Risks and approvals identified'];
const MODULES: { icon: typeof Bot; label: string }[] = [
  { icon: Bot, label: 'Agents' },
  { icon: Layers, label: 'Retrieval' },
  { icon: Plug, label: 'Integrations' },
  { icon: ShieldCheck, label: 'Guardrails' },
];
const EVALS = ['Accuracy on real cases', 'Awkward and edge cases', 'Security and permissions', 'Speed and cost'];
const ROLLOUT = ['Staging', 'Limited release', 'Full release'];
const HAND: { icon: typeof BookOpen; label: string }[] = [
  { icon: BookOpen, label: 'Documentation' },
  { icon: ClipboardList, label: 'Runbooks' },
  { icon: GraduationCap, label: 'Team training' },
  { icon: KeyRound, label: 'Access and ownership' },
  { icon: LifeBuoy, label: 'Support plan' },
];

export function ApproachDemo() {
  const { ref, t } = useLoop(DUR, HOLD, STILL);
  const { i, p } = sceneAt(t);
  const scene = SCENES[i];

  return (
    <div className="dm" ref={ref} role="img" aria-label="Animated illustration of the Axilabz delivery approach: engineers work closely with your business to discover and define the solution, build it on AxiCore, validate and deploy it, then hand it over to your team. Fictional sample content. A text description follows.">
      <div className="dm-stage cd-stage">
        <div className="dm-bar"><i /><i /><i /><span>Axilabz delivery · illustrative walkthrough · sample content</span></div>

        <div className="cd-body">
          <div className="cd-flow ap-flow">
            <span className={`cd-bracket${i >= 2 && i <= 4 ? ' on' : ''}`}><b>Built on AxiCore</b></span>
            <ol>
              {STEPS.map((s, n) => (
                <li key={s} className={`${n === i ? 'now' : ''}${n < i || (i === 5 && p > 0.9 && n === 5) ? ' done' : ''}`}>
                  <span className="cd-dot">{n < i ? <Check size={13} /> : n + 1}</span>
                  <b>{s}</b>
                </li>
              ))}
            </ol>
          </div>

          <div className="cd-scene">
            {i === 0 && (
              <div className="cd-two">
                <div className="cd-team">
                  <div className="cd-people"><Users size={26} /><span>Working side by side</span></div>
                  {PEOPLE.map((c, n) => <span key={c} className={`cd-chip${n < upTo(p * 1.2, 3) ? ' on' : ''}`}>{c}</span>)}
                </div>
                <div className="cd-card">
                  <strong>What we learn together</strong>
                  <ul>{LEARN.map((l, n) => <li key={l} className={n < upTo(p, 4) ? 'on' : ''}>{l}</li>)}</ul>
                </div>
              </div>
            )}

            {i === 1 && (
              <div className="cd-two">
                <div className="cd-card">
                  <strong>Solution brief</strong>
                  <ul>{BRIEF.map((l, n) => <li key={l} className={n < upTo(p * 1.1, 4) ? 'on' : ''}>{l}</li>)}</ul>
                </div>
                <div className="cd-team">
                  <div className="cd-people"><Check size={22} /><span>Agreed with you</span></div>
                  <span className={`cd-chip${p > 0.7 ? ' on' : ''}`}>Signed off before the build starts</span>
                </div>
              </div>
            )}

            {i === 2 && (
              <div className="cd-arch">
                <div className="cd-arch-row ap-modules">
                  {MODULES.map((m, n) => (
                    <div key={m.label} className={`cd-node${n < upTo(p * 1.1, 4) ? ' on' : ''}`}><m.icon size={20} /><span>{m.label}</span></div>
                  ))}
                </div>
                <div className="ap-progress"><i style={{ width: `${Math.round(p * 100)}%` }} /></div>
                <div className="cd-tags">
                  {['Automated tests', 'Code review', 'Security checks'].map((c, n) => <span key={c} className={`cd-chip${p > 0.5 + n * 0.15 ? ' on' : ''}`}>{c}</span>)}
                </div>
              </div>
            )}

            {i === 3 && (
              <ul className="cd-evals">
                {EVALS.map((l, n) => {
                  const start = n * 0.2;
                  const fill = clamp01((p - start) / 0.28);
                  const flagged = n === 1 && p > start + 0.2 && p < 0.7;
                  const passed = n === 1 ? p >= 0.7 : fill >= 1;
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
                  {['Monitoring on', 'Cost limits set', 'Alerts configured'].map((l, n) => <div key={l} className={p > 0.35 + n * 0.15 ? 'on' : ''}><Check size={16} /><span>{l}</span></div>)}
                </div>
              </div>
            )}

            {i === 5 && (
              <div className="ap-hand">
                <ul>
                  {HAND.map((h, n) => (
                    <li key={h.label} className={n < upTo(p * 1.3, 5) ? 'on' : ''}><h.icon size={18} /><span>{h.label}</span></li>
                  ))}
                </ul>
                <div className={`ap-done${p > 0.8 ? ' on' : ''}`}><Check size={18} /> Handed over. Your team owns it.</div>
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
        <p>Illustration using fictional sample content. It is not a recording of a real project or customer.</p>
        <ol>{SCENES.map((s) => <li key={s.title}><strong>{s.title}.</strong> {s.text}</li>)}</ol>
      </div>
    </div>
  );
}
