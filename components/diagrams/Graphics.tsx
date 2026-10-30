/** Flat pipeline diagram from the Axilabz moodboard: Your data -> AI model -> Product. */
export function DataFlow({ steps = ['Your data', 'AI model', 'Product'], label = 'How AI reaches your product' }: { steps?: string[]; label?: string }) {
  return (
    <figure className="dflow" aria-label={label}>
      <ol>
        {steps.map((s, i) => (
          <li key={s} className={i === 0 ? 'df-light' : i === steps.length - 1 ? 'df-dark' : 'df-cobalt'}>{s}</li>
        ))}
      </ol>
    </figure>
  );
}

/** Mono label chips. */
export function Chips({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul className="chips" aria-label="Quick links">
      {items.map((c) => (
        <li key={c.href}><a href={c.href}>{c.label}</a></li>
      ))}
    </ul>
  );
}
