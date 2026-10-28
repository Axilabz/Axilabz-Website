// Derives web-optimised logo and icons from the supplied logo files in assets-source/.
//   node scripts/build-brand-assets.mjs
import { createRequire } from 'node:module';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
function loadSharp() {
  try { return require('sharp'); } catch {}
  const store = join(process.cwd(), 'node_modules', '.pnpm');
  const dir = readdirSync(store).find((d) => d.startsWith('sharp@'));
  if (!dir) throw new Error('sharp not found. Install dependencies first.');
  return require(join(store, dir, 'node_modules', 'sharp'));
}
const sharp = loadSharp();

const full = await sharp('assets-source/axilabz-full-logo.png').trim().toBuffer();
await sharp(full).resize({ width: 760 }).webp({ quality: 95, alphaQuality: 100, effort: 6 }).toFile('public/brand/axilabz-logo.webp');
await sharp(full).resize({ width: 760 }).png({ compressionLevel: 9 }).toFile('public/brand/axilabz-logo.png');
const a = await sharp('assets-source/axilabz-a-logo.png').trim().toBuffer();
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
await sharp(a).resize(256, 256, { fit: 'contain', background: clear }).png().toFile('public/brand/axilabz-icon-256.png');
await sharp(a).resize(48, 48, { fit: 'contain', background: clear }).png().toFile('public/favicon-48.png');
console.log('done');

// Footer lockup: keeps the transparent background, white wordmark and tagline, mark and amber dot keep their colours.
{
  const { data, info } = await sharp(full).resize({ width: 760 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const splitX = Math.round(info.width * (308 / 760)); // the mark ends here; wordmark and tagline start
  const out = Buffer.alloc(data.length);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      const keep = x < splitX || chroma > 60; // mark, or a coloured pixel such as the amber dot
      if (keep) { out[i] = r; out[i + 1] = g; out[i + 2] = b; } else { out[i] = out[i + 1] = out[i + 2] = 255; }
      out[i + 3] = data[i + 3];
    }
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png({ compressionLevel: 9 }).toFile('public/brand/axilabz-logo-light.png');
}
console.log('footer logo done');
