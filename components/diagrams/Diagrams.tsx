/**
 * Left-to-right process flow in the brand's blue/amber language. Pure HTML+CSS
 * (list semantics, no JS), stacking vertically on small screens.
 */
export function WorkflowDiagram({ title, steps }: { title: string; steps: { label: string; detail: string }[] }) {
  return (
    <figure className="flow">
      <figcaption>{title}</figcaption>
      <ol>
        {steps.map((s, i) => (
          <li key={s.label} style={{ ['--i' as string]: i }}>
            <span className="flow-node" aria-hidden="true">{i + 1}</span>
            <strong>{s.label}</strong>
            <small>{s.detail}</small>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/**
 * Illustrative interface preview. It is explicitly labelled as a demonstration
 * and shows sample content, never real customer data or measured results.
 */
export function ProductMock({ title, rows, name }: { title: string; rows: { k: string; v: string }[]; name: string }) {
  return (
    <figure className="mock">
      <div className="mock-chrome" aria-hidden="true"><i /><i /><i /></div>
      <div className="mock-body">
        <strong>{title}</strong>
        <dl>
          {rows.map((r) => (
            <div key={r.k}><dt>{r.k}</dt><dd>{r.v}</dd></div>
          ))}
        </dl>
      </div>
      <figcaption>Illustrative mockup of {name} with sample content. Not a screenshot of released functionality.</figcaption>
    </figure>
  );
}
