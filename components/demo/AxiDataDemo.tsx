'use client';

import { Check, Database, ShieldCheck, Table2 } from 'lucide-react';
import { useLoop } from './useLoop';

/**
 * Illustrative AxiData walkthrough that runs by itself in a loop: a plain-English question becomes SQL
 * that can be reviewed, runs read-only, and returns a table and chart. Everything on screen is a pure
 * function of the playhead. Fictional sample data, labelled as an illustration.
 */

const DUR = 31000;
const HOLD = 2200;
const STILL = 29500;
const CUTS = [0, 5000, 10000, 16000, 21000, 27000, DUR] as const;
const STEPS = ['Ask', 'Understand', 'Generate', 'Run', 'Answer'] as const;

const SCENES = [
  { title: 'Ask in plain English', text: 'A business question is typed the way it would be said to a colleague. No SQL needed.' },
  { title: 'Understand your schema', text: 'The question is mapped to your own tables, columns and business definitions.' },
  { title: 'Generate SQL you can read', text: 'A query is drafted and shown, so it can be checked, edited and reused.' },
  { title: 'Run it safely', text: 'The query runs read-only, within the tables, columns and rows that person is allowed to see.' },
  { title: 'Get the answer', text: 'The result comes back as a table and chart, with the query kept alongside for review.' },
  { title: 'Keep asking', text: 'Follow-up questions build on the last answer, and the SQL stays visible each time.' },
] as const;

const QUESTION = 'Show me revenue by region for last quarter';
const FOLLOW = 'Now only the top region, by month';
const TABLES: { name: string; cols: string }[] = [
  { name: 'orders', cols: 'order_id, region_id, amount, order_date' },
  { name: 'regions', cols: 'region_id, region_name' },
];
const SQL = [
  'SELECT r.region_name,',
  '       SUM(o.amount) AS revenue,',
  '       COUNT(*) AS orders',
  'FROM orders o',
  'JOIN regions r USING (region_id)',
  "WHERE o.order_date >= DATE '2026-01-01'",
  "  AND o.order_date <  DATE '2026-04-01'",
  'GROUP BY r.region_name',
  'ORDER BY revenue DESC;',
];
const CHECKS = ['Read-only connection', 'Allowed tables and columns only', 'Row limit applied'];
const ROWS: [string, number, number][] = [
  ['North', 412000, 1180],
  ['West', 366000, 1042],
  ['South', 301000, 905],
];
const MONTHS: [string, number][] = [['Jan', 118000], ['Feb', 132000], ['Mar', 162000]];

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const upTo = (p: number, n: number) => Math.min(n, Math.floor(p * (n + 0.99)));
const fmt = (n: number) => n.toLocaleString('en-US');

function sceneAt(t: number) {
  let i = 0;
  for (let k = 0; k < CUTS.length - 1; k++) if (t >= CUTS[k]) i = k;
  return { i, p: clamp01((t - CUTS[i]) / (CUTS[i + 1] - CUTS[i])) };
}

export function AxiDataDemo() {
  const { ref, t } = useLoop(DUR, HOLD, STILL);
  const { i, p } = sceneAt(t);
  const scene = SCENES[i];
  const active = Math.min(i, 4);
  const follow = i === 5;
  const typed = i === 0 ? QUESTION.slice(0, Math.ceil(clamp01(p * 1.15) * QUESTION.length)) : follow ? FOLLOW.slice(0, Math.ceil(clamp01(p * 2) * FOLLOW.length)) : QUESTION;
  const max = Math.max(...ROWS.map((r) => r[1]));
  const showTable = i === 4 || (follow && p < 0.5);
  const tableP = i === 4 ? p : 1;

  return (
    <div className="dm" ref={ref} role="img" aria-label="Animated illustration of AxiData turning a plain-English question into reviewable SQL and a result. Fictional sample data. A text description follows.">
      <div className="dm-stage cd-stage">
        <div className="dm-bar"><i /><i /><i /><span>AxiData · illustrative demo · sample data</span></div>

        <div className="cd-body ad-body">
          <div className="cd-flow">
            <ol>
              {STEPS.map((s, n) => {
                const done = i === 5 || n < i;
                return (
                  <li key={s} className={`${n === active && i < 5 ? 'now' : ''}${done ? ' done' : ''}`}>
                    <span className="cd-dot">{done ? <Check size={13} /> : n + 1}</span>
                    <b>{s}</b>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="cd-two ad-two">
            <div className="ad-ask">
              <small>Natural-language question</small>
              <div className="ad-input">{typed}<span className="ad-caret" /></div>
              {i === 1 && (
                <ul className="cd-list ad-tables">
                  {TABLES.map((tb, n) => (
                    <li key={tb.name} className={n < upTo(p, 2) ? 'on' : ''}><Database size={14} /><span><b>{tb.name}</b> · {tb.cols}</span></li>
                  ))}
                </ul>
              )}
              {i === 3 && (
                <ul className="cd-list ad-tables">
                  {CHECKS.map((c, n) => (
                    <li key={c} className={n < upTo(p * 1.15, 3) ? 'on' : ''}><ShieldCheck size={14} /><span>{c}</span></li>
                  ))}
                </ul>
              )}
              {i === 0 && <p className="ad-hint">Sample question. The data shown is fictional.</p>}
            </div>

            <div className="ad-out">
              {(i === 0 || i === 1) && (
                <div className="ad-empty"><Table2 size={22} /><span>{i === 0 ? 'Results will appear here' : 'Mapping question to schema…'}</span></div>
              )}

              {(i === 2 || i === 3) && (
                <pre className="cd-code ad-sql">{SQL.slice(0, i === 2 ? upTo(p * 1.1, SQL.length) : SQL.length).join('\n')}</pre>
              )}

              {showTable && (
                <div className="ad-result">
                  <div className="ad-head"><strong>Query results</strong><span className="dm-chip ok">{ROWS.length} rows</span></div>
                  <table>
                    <thead><tr><th>Region</th><th>Revenue</th><th>Orders</th></tr></thead>
                    <tbody>
                      {ROWS.map((r, n) => (
                        <tr key={r[0]} className={n < upTo(tableP * 1.1, ROWS.length) ? 'on' : ''}>
                          <td>{r[0]}</td>
                          <td><span className="ad-bar"><i style={{ width: `${(r[1] / max) * 100 * clamp01(tableP * 2 - n * 0.3)}%` }} /></span>{fmt(r[1])}</td>
                          <td>{fmt(r[2])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {follow && p >= 0.5 && (
                <div className="ad-result">
                  <div className="ad-head"><strong>North, by month</strong><span className="dm-chip ok">3 rows</span></div>
                  <div className="ad-cols">
                    {MONTHS.map(([m, v], n) => (
                      <div key={m}><i style={{ '--h': (v / 162000) * clamp01((p - 0.5) * 2.4 - n * 0.2) } as React.CSSProperties} /><b>{m}</b><span>{fmt(v)}</span></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dm-caption">
          <b>{scene.title}</b>
          <span>{scene.text}</span>
        </div>
      </div>

      <div className="sr-only">
        <p>Illustration using fictional sample data. It is not a recording of released functionality or a real customer.</p>
        <ol>{SCENES.map((s) => <li key={s.title}><strong>{s.title}.</strong> {s.text}</li>)}</ol>
      </div>
    </div>
  );
}
