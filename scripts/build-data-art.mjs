// Builds the AxiData product-card illustration (1x / 2x / 4x) from the supplied artwork.
//   node scripts/build-data-art.mjs
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
const white = { r: 255, g: 255, b: 255, alpha: 1 };
for (const [suffix, w] of [['', 332], ['-2x', 664], ['-4x', 1328]]) {
  const h = Math.round((w * 148) / 332);
  await sharp('assets-source/product-data.webp').resize(w, h, { fit: 'contain', background: white, kernel: 'lanczos3' }).webp({ quality: 92, effort: 6 }).toFile(`public/art/product-data${suffix}.webp`);
}
console.log('done');
