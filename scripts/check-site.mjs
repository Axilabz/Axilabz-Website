// Crawls a running instance and checks routes, metadata, headings, internal
// links, assets and JSON-LD. Usage: BASE=http://127.0.0.1:8787 node scripts/check-site.mjs
const BASE = (process.env.BASE || 'http://127.0.0.1:8787').replace(/\/$/, '');
const seeds = ['/', '/about', '/services', '/industries', '/approach', '/labz', '/careers', '/contact', '/products', '/privacy', '/terms'];

const problems = [];
const pages = new Map();
const queue = [...seeds];
const seen = new Set();

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await fetch(BASE + path, { redirect: 'manual' });
  if (res.status !== 200) { problems.push(`${path}: HTTP ${res.status}`); continue; }
  const html = await res.text();
  pages.set(path, html);
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    let href = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    href = href.split('#')[0].split('?')[0];
    if (href && href.startsWith('/') && !seen.has(href)) queue.push(href);
  }
}

const titles = new Map();
const descs = new Map();
for (const [path, html] of pages) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (!title) problems.push(`${path}: missing <title>`);
  if (!desc) problems.push(`${path}: missing description`);
  if (!canon) problems.push(`${path}: missing canonical`);
  else if (path === '/' ? !/^https?:\/\/[^/]+\/?$/.test(canon) && canon !== '/' : !canon.endsWith(path)) problems.push(`${path}: canonical mismatch (${canon})`);
  if (h1 !== 1) problems.push(`${path}: ${h1} <h1> elements`);
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) problems.push(`${path}: unexpected noindex`);
  if (!/<html lang="en"/.test(html)) problems.push(`${path}: missing lang`);
  if (title) titles.set(title, [...(titles.get(title) || []), path]);
  if (desc) descs.set(desc, [...(descs.get(desc) || []), path]);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) problems.push(`${path}: duplicate ids ${[...new Set(dup)].join(', ')}`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { problems.push(`${path}: invalid JSON-LD`); }
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (attr(m[0], 'alt') === undefined) problems.push(`${path}: <img> without alt`);
  }
  // in-page anchors must exist
  for (const m of html.matchAll(/<a\b[^>]*\shref="#([^"]+)"/g)) {
    if (!ids.includes(m[1])) problems.push(`${path}: broken in-page anchor #${m[1]}`);
  }
}
for (const [t, ps] of titles) if (ps.length > 1) problems.push(`duplicate title "${t}": ${ps.join(', ')}`);
for (const [, ps] of descs) if (ps.length > 1) problems.push(`duplicate description: ${ps.join(', ')}`);

// Cross-page anchors (e.g. /industries#retail) and assets
const assets = new Set();
for (const [path, html] of pages) {
  for (const m of html.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)#([^"]+)"/g)) {
    const target = pages.get(m[1]);
    if (target && !new RegExp(`\\sid="${m[2]}"`).test(target)) problems.push(`${path}: broken anchor ${m[1]}#${m[2]}`);
  }
  for (const m of html.matchAll(/(?:src|href)="(\/[^"]+\.(?:png|webp|svg|jpg|ico|css|js))"/g)) assets.add(m[1]);
}
for (const a of assets) {
  const r = await fetch(BASE + a);
  if (!r.ok) problems.push(`asset ${a}: HTTP ${r.status}`);
}

console.log(`Checked ${pages.size} pages, ${assets.size} assets.`);
console.log([...pages.keys()].sort().join('\n'));
if (problems.length) { console.log(`\n${problems.length} problem(s):`); for (const p of problems) console.log(' - ' + p); process.exit(1); }
console.log('\nAll checks passed.');
