// Cuts the AI-generated icon sheets (3 x 2 gold line icons on pure black, from Codex image generation)
// into single transparent icons for variants/molique-site/src/assets/icons/.
//
// The icons are used as CSS masks, so only the alpha channel matters: gold-on-black luminance becomes
// opacity, and the lines are thickened slightly so they survive being shown at 60-110 px.
//
// Usage: node scripts/make-icons.mjs <folder containing icons-a.png and icons-b.png>
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sharp = createRequire(join(root, 'package.json'))('sharp');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/make-icons.mjs <folder containing icons-a.png and icons-b.png>');
  process.exit(1);
}

// Reading order of every sheet: top row left to right, then bottom row.
const sheets = {
  'icons-a.png': ['clock', 'phone', 'mail', 'pin', 'house', 'hourglass'],
  'icons-b.png': ['shield', 'scales', 'calendar', 'pen', 'certificate', 'heart'],
};
const out = join(root, 'variants', 'molique-site', 'src', 'assets', 'icons');
mkdirSync(out, { recursive: true });

const SIZE = 320; // output pixels (square)
const PAD = 0.1; // empty margin around each icon, as a share of its longest side

/** Contiguous runs of indices whose profile value is above `min`, merging gaps shorter than `gap`. */
function segments(profile, min, gap) {
  const runs = [];
  let start = -1;
  for (let i = 0; i <= profile.length; i++) {
    const on = i < profile.length && profile[i] > min;
    if (on && start < 0) start = i;
    if (!on && start >= 0) {
      runs.push([start, i - 1]);
      start = -1;
    }
  }
  const merged = [];
  for (const r of runs) {
    const last = merged[merged.length - 1];
    if (last && r[0] - last[1] < gap) last[1] = r[1];
    else merged.push([...r]);
  }
  return merged;
}

for (const [file, names] of Object.entries(sheets)) {
  const { data, info } = await sharp(join(src, file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const red = (x, y) => data[(y * W + x) * C]; // gold has a strong red channel; black is 0

  const cols = new Array(W).fill(0);
  const rows = new Array(H).fill(0);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (red(x, y) > 40) {
        cols[x]++;
        rows[y]++;
      }
  const colSegs = segments(cols, 2, 30);
  const rowSegs = segments(rows, 2, 30);
  if (colSegs.length !== 3 || rowSegs.length !== 2) {
    throw new Error(`${file}: expected 3 columns and 2 rows, found ${colSegs.length} and ${rowSegs.length}`);
  }

  let n = 0;
  for (const [y0, y1] of rowSegs) {
    for (const [x0, x1] of colSegs) {
      const name = names[n++];
      // tight bounding box of this icon inside its cell
      let minX = x1, maxX = x0, minY = y1, maxY = y0;
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++)
          if (red(x, y) > 40) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
      const w = maxX - minX + 1;
      const h = maxY - minY + 1;
      const side = Math.round(Math.max(w, h) * (1 + PAD * 2));
      const left = Math.round((minX + maxX) / 2 - side / 2);
      const top = Math.round((minY + maxY) / 2 - side / 2);

      // alpha = how gold the pixel is (0 on black, 1 on full gold)
      const alpha = Buffer.alloc(side * side);
      for (let y = 0; y < side; y++)
        for (let x = 0; x < side; x++) {
          const sx = left + x, sy = top + y;
          const v = sx >= 0 && sy >= 0 && sx < W && sy < H ? red(sx, sy) : 0;
          alpha[y * side + x] = Math.max(0, Math.min(255, Math.round(((v - 8) / 212) * 255)));
        }
      // thicken the hairlines a little (blur, then lift the alpha), then scale down
      const { data: thick, info: tinfo } = await sharp(alpha, { raw: { width: side, height: side, channels: 1 } })
        .blur(Math.max(0.8, side / 260))
        .linear(2.1, -20)
        .resize(SIZE, SIZE, { kernel: 'lanczos3' })
        .toColourspace('b-w')
        .raw()
        .toBuffer({ resolveWithObject: true });
      const rgba = Buffer.alloc(SIZE * SIZE * 4);
      for (let i = 0; i < SIZE * SIZE; i++) {
        rgba[i * 4] = 214; rgba[i * 4 + 1] = 181; rgba[i * 4 + 2] = 106; rgba[i * 4 + 3] = thick[i * tinfo.channels];
      }
      await sharp(rgba, { raw: { width: SIZE, height: SIZE, channels: 4 } })
        .webp({ lossless: true, effort: 6 })
        .toFile(join(out, `${name}.webp`));
      console.log(`${name.padEnd(12)} ${w}x${h} -> ${SIZE}x${SIZE}`);
    }
  }
}
