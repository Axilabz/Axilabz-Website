'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Check, FileText, TriangleAlert } from 'lucide-react';

/**
 * Illustrative AxiDoc walkthrough that runs by itself in a loop, like an animated graphic (no player,
 * no controls). Everything on screen is a pure function of the playhead `t`. It only animates while it
 * is on screen, and shows one still frame when the visitor prefers reduced motion. All data is
 * fictional sample data and the graphic is labelled as an illustration.
 */

const DUR = 30000;
const HOLD = 1800; // pause on the closing frame before the loop restarts
const STILL = 26500; // frame shown for reduced-motion visitors
const CUTS = [0, 4000, 10000, 16000, 22000, 28000, DUR] as const;

const SCENES = [
  { title: 'Drop in a document', text: 'An invoice arrives by email, upload or API. AxiDoc receives it and keeps the original for audit.' },
  { title: 'Classify and extract', text: 'The document type is recognised and the fields that matter are read, including line items.' },
  { title: 'Validate against your rules', text: 'Values are checked against reference data and each other. Anything that does not add up is flagged.' },
  { title: 'Review only the exceptions', text: 'A person confirms or corrects the flagged value. Everything that passed needs no attention.' },
  { title: 'Deliver clean, traceable data', text: 'Structured data goes to your finance or workflow system, linked back to the source document.' },
  { title: 'Every value traceable', text: 'Each field can be traced to where it appeared in the original document.' },
] as const;

const FIELDS: [string, string][] = [
  ['Supplier', 'Sample Supplies Ltd'],
  ['Invoice no.', 'INV-1042'],
  ['Invoice date', '14 Mar 2026'],
  ['PO reference', 'PO-7781'],
  ['Line items', '3 found'],
  ['Total due', '1,290.00'],
];

const CHECKS: { label: string; ok: boolean; note?: string }[] = [
  { label: 'Supplier exists in vendor list', ok: true },
  { label: 'PO reference matches an open order', ok: true },
  { label: 'Invoice date is valid', ok: true },
  { label: 'Line items add up to the total', ok: false, note: 'Total differs by 30.00' },
];

const JSON_LINES = ['{', '  "supplier": "Sample Supplies Ltd",', '  "invoice": "INV-1042",', '  "po": "PO-7781",', '  "total": 1260.00,', '  "status": "approved",', '  "source": "invoice_1042.pdf"', '}'];

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function sceneAt(t: number) {
  let i = 0;
  for (let k = 0; k < CUTS.length - 1; k++) if (t >= CUTS[k]) i = k;
  const p = clamp01((t - CUTS[i]) / (CUTS[i + 1] - CUTS[i]));
  return { i, p };
}

const subscribeMotion = (cb: () => void) => {
  const q = window.matchMedia('(prefers-reduced-motion: reduce)');
  q.addEventListener('change', cb);
  return () => q.removeEventListener('change', cb);
};

export function AxiDocDemo() {
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => false);
  const [t, setT] = useState(0);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // run only while the graphic is on screen
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !visible) return;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - prev, 100);
      prev = now;
      setT((cur) => { const n = cur + dt; return n >= DUR + HOLD ? 0 : n; });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, visible]);

  const tt = reduced ? STILL : Math.min(t, DUR);
  const { i, p } = sceneAt(tt);
  const scene = SCENES[i];

  // derived frame state
  const docIn = i === 0 ? p : 1;
  const scanY = i === 1 ? p : i < 1 ? 0 : 1;
  const extracted = i < 1 ? 0 : i === 1 ? Math.floor(p * 6.99) + 1 : 6;
  const checksShown = i < 2 ? 0 : i === 2 ? Math.min(4, Math.floor(p * 4.99) + 1) : 4;
  const fixed = i > 3 || (i === 3 && p >= 0.5);
  const status =
    i === 0 ? ['Received', 'info'] : i === 1 ? ['Extracting', 'info'] : i === 2 ? (checksShown >= 4 ? ['Needs review', 'warn'] : ['Validating', 'info'])
      : i === 3 ? (fixed ? ['Approved', 'ok'] : ['In review', 'warn']) : ['Delivered', 'ok'];
  const jsonShown = i < 4 ? 0 : i === 4 ? Math.min(JSON_LINES.length, Math.floor(p * 1.6 * JSON_LINES.length) + 1) : JSON_LINES.length;
  const total = fixed ? '1,260.00' : '1,290.00';

  return (
    <div className="dm" ref={root} role="img" aria-label="Animated illustration of AxiDoc turning an invoice into reviewed, structured data. Fictional sample data. A text description follows.">
      <div className="dm-stage">
        <div className="dm-bar"><i /><i /><i /><span>AxiDoc · illustrative demo · sample data</span></div>

        <div className="dm-body">
          <div className="dm-docwrap">
            <div className="dm-doc" style={{ opacity: docIn, transform: `translateX(${(1 - docIn) * -18}%)` }}>
              {i === 1 && <span className="dm-scan" style={{ top: `${scanY * 100}%` }} />}
              <div className="dm-doc-head"><FileText size={14} /> invoice_1042.pdf</div>
              <div className="dm-doc-title">SAMPLE SUPPLIES LTD</div>
              <div className={`dm-row${extracted >= 2 ? ' hit' : ''}`}><span>Invoice</span><b>INV-1042</b></div>
              <div className={`dm-row${extracted >= 3 ? ' hit' : ''}`}><span>Date</span><b>14 Mar 2026</b></div>
              <div className={`dm-row${extracted >= 4 ? ' hit' : ''}`}><span>PO</span><b>PO-7781</b></div>
              <div className={`dm-lines${extracted >= 5 ? ' hit' : ''}`}>
                <div><span>Paper stock</span><b>640.00</b></div>
                <div><span>Toner x4</span><b>340.00</b></div>
                <div><span>Delivery</span><b>280.00</b></div>
              </div>
              <div className={`dm-row total${extracted >= 6 ? ' hit' : ''}${i === 2 && checksShown >= 4 ? ' flag' : ''}`}><span>Total due</span><b>{total}</b></div>
            </div>
          </div>

          <div className={`dm-panel${i === 2 || i === 3 ? ' has-extra' : ''}`}>
            <div className="dm-panel-head">
              <strong>{i === 0 ? 'Upload' : i === 1 ? 'Extracted fields' : i === 2 ? 'Validation' : i === 3 ? 'Review' : 'Delivery'}</strong>
              <span className={`dm-chip ${status[1]}`}>{status[0]}</span>
            </div>

            {i === 0 && (
              <div className="dm-drop">
                <div className="dm-progress"><span style={{ width: `${Math.round(p * 100)}%` }} /></div>
                <small>{p < 0.95 ? 'Receiving invoice_1042.pdf…' : 'Received invoice_1042.pdf'}</small>
              </div>
            )}

            {(i === 1 || i === 2 || i === 3) && (
              <ul className="dm-fields">
                {FIELDS.map(([k, v], n) => (
                  <li key={k} className={n < extracted ? 'on' : ''}>
                    <span>{k}</span>
                    <b>{k === 'Total due' ? total : v}</b>
                  </li>
                ))}
              </ul>
            )}

            {i === 2 && (
              <ul className="dm-checks">
                {CHECKS.map((c, n) => (
                  <li key={c.label} className={n < checksShown ? (c.ok ? 'ok' : 'bad') : ''}>
                    {n < checksShown && (c.ok ? <Check size={14} /> : <TriangleAlert size={14} />)}
                    <span>{c.label}{n < checksShown && c.note ? ` · ${c.note}` : ''}</span>
                  </li>
                ))}
              </ul>
            )}

            {i === 3 && (
              <div className="dm-review">
                <span>Reviewer corrects the flagged total to match the line items.</span>
                <b className={fixed ? 'fixed' : ''}>{fixed ? 'Total due: 1,260.00 ✓' : 'Total due: 1,290.00 (flagged)'}</b>
              </div>
            )}

            {i >= 4 && (
              <>
                <pre className="dm-json">{JSON_LINES.slice(0, jsonShown).join('\n')}</pre>
                <div className="dm-sent">{jsonShown >= JSON_LINES.length ? <><Check size={14} /> Sent to finance system (sample) · source document linked</> : 'Preparing structured output…'}</div>
              </>
            )}
          </div>
        </div>

        <div className="dm-caption">
          <b>{scene.title}</b>
          <span>{scene.text}</span>
        </div>

      </div>

      <div className="sr-only">
        <p>Illustration using fictional sample data. It is not a recording of released functionality or a real customer.</p>
        <ol>
          {SCENES.map((s) => <li key={s.title}><strong>{s.title}.</strong> {s.text}</li>)}
        </ol>
      </div>
    </div>
  );
}
