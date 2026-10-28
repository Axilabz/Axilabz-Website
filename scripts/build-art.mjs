// Builds the A / X / I / Labz section graphics from the supplied high-resolution designs
// (assets-source/design/hq-*.webp). Text, icons and cards inside the artwork are part of the
// supplied images, so nothing is cropped out, repainted or upscaled.
//
//   node scripts/build-art.mjs   ->  public/art/<name>.webp (1x, half width), <name>-2x.webp (native)
//                                    lib/art-meta.json (canvas/padding sizes used for layout)
//
// To make each picture melt into the website gradient (no visible rectangle), the canvas is extended
// beyond the supplied image by a soft "glow" halo: the image's own edge pixels are replicated outward, blurred,
// and faded to transparent. The halo continues the exact colours at the image edge, so the seam is
// invisible, and it fades into whatever section background sits behind it.
import { createRequire } from 'node:module';
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
function loadSharp() {
  try { return require('sharp'); } catch {}
  const store = join(process.cwd(), 'node_modules', '.pnpm');
  const dir = readdirSync(store).find((d) => d.startsWith('sharp@'));
  return require(join(store, dir, 'node_modules', 'sharp'));
}
const sharp = loadSharp();

// pad:   halo size on each side as a fraction of the image width (l, r) / height (t, b)
// inset: how far into the supplied image the fade-out already begins (keeps content near the edge fully opaque when 0)
const jobs = [
  { src: 'hq-a', out: 'section-a', pad: { l: 0.14, r: 0.06, t: 0.06, b: 0.06 }, inset: { l: 0.22, r: 0.04, t: 0.14, b: 0.1 } },
  { src: 'hq-x', out: 'section-x', pad: { l: 0.18, r: 0.14, t: 0.08, b: 0.08 }, inset: {} },
  { src: 'hq-i', out: 'section-i', pad: { l: 0.22, r: 0.08, t: 0.08, b: 0.08 }, inset: { l: 0.1, r: 0.06, t: 0.14, b: 0.12 } },
  { src: 'hq-labz', out: 'labz-hero', pad: { l: 0.14, r: 0.04, t: 0.09, b: 0.08 }, inset: { l: 0.1, r: 0.03, t: 0.07, b: 0.08 } },
];

const meta = {};
const smooth = (t) => t * t * (3 - 2 * t);

for (const j of jobs) {
  const orig = await sharp(`assets-source/design/${j.src}.webp`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = orig.info.width, H = orig.info.height;
  const pl = Math.round(W * j.pad.l), pr = Math.round(W * j.pad.r), pt = Math.round(H * j.pad.t), pb = Math.round(H * j.pad.b);
  const CW = W + pl + pr, CH = H + pt + pb;

  // ambient glow: mirrored image, heavily blurred
  const amb = await sharp(orig.data, { raw: { width: W, height: H, channels: 3 } })
    .extend({ top: pt, bottom: pb, left: pl, right: pr, extendWith: 'copy' })
    .blur(Math.max(12, Math.round(Math.max(pl, pr, pt, pb) * 0.4)))
    .raw().toBuffer();

  const out = Buffer.alloc(CW * CH * 4);
  const ramp = Math.max(6, Math.round(W / 140)); // px over which the sharp image blends into the halo
  const ins = { l: pl + (j.inset.l ?? 0) * W, r: pr + (j.inset.r ?? 0) * W, t: pt + (j.inset.t ?? 0) * H, b: pb + (j.inset.b ?? 0) * H };
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      const o = (y * CW + x) * 4, a = (y * CW + x) * 3;
      const ix = x - pl, iy = y - pt;
      let r = amb[a], g = amb[a + 1], b = amb[a + 2];
      if (ix >= 0 && ix < W && iy >= 0 && iy < H) {
        // inside the supplied image: sharp pixels, blended into the halo over the last `ramp` px
        const ex = Math.min(pl ? ix : 1e9, pr ? W - 1 - ix : 1e9), ey = Math.min(pt ? iy : 1e9, pb ? H - 1 - iy : 1e9);
        const w = Math.min(1, (Math.min(ex, ey) + 1) / ramp);
        const s0 = (iy * W + ix) * 3;
        r = orig.data[s0] * w + r * (1 - w);
        g = orig.data[s0 + 1] * w + g * (1 - w);
        b = orig.data[s0 + 2] * w + b * (1 - w);
      }
      // distance outside the "fully opaque" inner rectangle, normalised to the canvas edge (0 inside, 1 at the edge)
      const dl = x < ins.l ? (ins.l - x) / ins.l : 0, dr = x > CW - 1 - ins.r ? (x - (CW - 1 - ins.r)) / ins.r : 0;
      const dt = y < ins.t ? (ins.t - y) / ins.t : 0, db = y > CH - 1 - ins.b ? (y - (CH - 1 - ins.b)) / ins.b : 0;
      const t = Math.min(1, Math.hypot(Math.max(dl, dr), Math.max(dt, db)));
      // fade to transparent, drifting toward white so saturated pictures dissolve into a light section background
      const m = smooth(t) * 0.6;
      r = r * (1 - m) + 255 * m; g = g * (1 - m) + 255 * m; b = b * (1 - m) + 255 * m;
      out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = Math.round(255 * (1 - smooth(t)) ** 2);
    }
  }

  const base = sharp(out, { raw: { width: CW, height: CH, channels: 4 } });
  const w1 = Math.round(CW / 2);
  await base.clone().resize(w1, Math.round((w1 * CH) / CW), { kernel: 'lanczos3' }).webp({ quality: 92, alphaQuality: 90, effort: 6 }).toFile(`public/art/${j.out}.webp`);
  await base.clone().webp({ quality: 93, alphaQuality: 92, effort: 6 }).toFile(`public/art/${j.out}-2x.webp`);
  meta[j.out] = { w: W, h: H, pl, pr, pt, pb, cw: CW, ch: CH, w1 };
  console.log(j.out, `canvas ${CW}x${CH} (image ${W}x${H}, halo l${pl} r${pr} t${pt} b${pb})`);
}

writeFileSync('lib/art-meta.json', JSON.stringify(meta, null, 2) + '\n');
