// Builds the four Labz product illustrations (AxiVoice / AxiDoc / AxiCore / AxiSolve) from the supplied
// labz-reference artwork: precrop -> Real-ESRGAN 4x upscale (assets-source/upscaled) -> compose WebP 1x/2x/4x.
//   node scripts/build-section-art.mjs precrop | compose
// The A / X / I / Labz section graphics come from scripts/build-art.mjs.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
function loadSharp() {
  try { return require('sharp'); } catch {}
  const store = join(process.cwd(), 'node_modules', '.pnpm');
  const dir = readdirSync(store).find((d) => d.startsWith('sharp@'));
  return require(join(store, dir, 'node_modules', 'sharp'));
}
const sharp = loadSharp();
const stage = process.argv[2] || 'compose';

// fade*: fraction of each side faded into transparency so the graphic blends into its section
const jobs = [
  // Labz chapter graphics (from the supplied labz-reference.png)
  { file: 'assets-source/legacy/labz-reference.png', out: 'product-voice', box: { left: 98, top: 532, width: 332, height: 148 }, fadeT: 0.1, fadeB: 0.17 },
  { file: 'assets-source/legacy/labz-reference.png', out: 'product-doc', box: { left: 492, top: 532, width: 332, height: 148 }, fadeT: 0.1, fadeB: 0.17 },
  { file: 'assets-source/legacy/labz-reference.png', out: 'product-core', box: { left: 867, top: 532, width: 332, height: 148 }, fadeT: 0.1, fadeB: 0.17 },
  { file: 'assets-source/legacy/labz-reference.png', out: 'product-solve', box: { left: 1256, top: 532, width: 332, height: 148 }, fadeT: 0.1, fadeB: 0.17 },
];

function eraseRegion(data, W, e) {
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = e.sample.y; y < e.sample.y + e.sample.h; y++) {
    for (let x = e.sample.x; x < e.sample.x + e.sample.w; x++) {
      const i = (y * W + x) * 4;
      r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
    }
  }
  r /= n; g /= n; b /= n;
  for (let y = e.y; y < e.y + e.h; y++) {
    for (let x = e.x; x < e.x + e.w; x++) {
      const d = Math.min(e.x + e.w - 1 - x, y - e.y, e.y + e.h - 1 - y); // left edge is the crop edge: no feather
      const wgt = Math.min(1, d / e.feather);
      const i = (y * W + x) * 4;
      data[i] = data[i] * (1 - wgt) + r * wgt;
      data[i + 1] = data[i + 1] * (1 - wgt) + g * wgt;
      data[i + 2] = data[i + 2] * (1 - wgt) + b * wgt;
    }
  }
}

function applyFades(data, W, H, j) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let a = 1;
      if (j.fadeL && x < W * j.fadeL) a = Math.min(a, x / (W * j.fadeL));
      if (j.fadeR && x > W * (1 - j.fadeR)) a = Math.min(a, (W - 1 - x) / (W * j.fadeR));
      if (j.fadeT && y < H * j.fadeT) a = Math.min(a, y / (H * j.fadeT));
      if (j.fadeB && y > H * (1 - j.fadeB)) a = Math.min(a, (H - 1 - y) / (H * j.fadeB));
      data[(y * W + x) * 4 + 3] = Math.round(255 * Math.max(0, Math.min(1, a)));
    }
  }
}

mkdirSync('assets-source/precrop', { recursive: true });
mkdirSync('assets-source/upscaled', { recursive: true });

for (const j of jobs) {
  if (stage === 'precrop') {
    const { data, info } = await sharp(j.file ?? `assets-source/design/${j.src}.webp`).extract(j.box).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (j.erase) eraseRegion(data, info.width, j.erase);
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).removeAlpha().png().toFile(`assets-source/precrop/${j.out}.png`);
    console.log('precrop', j.out, info.width, info.height);
    continue;
  }

  // compose: prefer the AI-upscaled image; fall back to the precrop with a Lanczos upscale
  const upscaled = `assets-source/upscaled/${j.out}.png`;
  const hasAi = existsSync(upscaled);
  const { data, info } = await sharp(hasAi ? upscaled : `assets-source/precrop/${j.out}.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  applyFades(data, W, H, j);
  const base = sharp(data, { raw: { width: W, height: H, channels: 4 } });
  const baseW = j.box.width;
  const sizes = [[1, ''], [2, '-2x'], [4, '-4x']];
  for (const [mult, suffix] of sizes) {
    const tw = baseW * mult, th = Math.round(j.box.height * mult);
    let img = base.clone();
    if (tw !== W) img = img.resize(tw, th, { kernel: 'lanczos3' });
    if (!hasAi && mult > 1) img = img.sharpen({ sigma: 0.8, m1: 0.8, m2: 0.5 });
    await img.webp({ quality: mult === 4 ? 88 : 93, alphaQuality: 92, effort: 6 }).toFile(`public/art/${j.out}${suffix}.webp`);
  }
  console.log('compose', j.out, hasAi ? 'AI-upscaled source' : 'Lanczos fallback', `${W}x${H}`);
}
