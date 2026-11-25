// Converts the AI-generated PNGs (from Codex image generation) into web-ready WebP files inside
// variants/molique-site/src/assets/ai, so the repository stays small.
//
// Usage: node scripts/optimize-ai-images.mjs <folder-with-png-files>
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sharp = createRequire(join(root, 'package.json'))('sharp');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/optimize-ai-images.mjs <folder-with-png-files>');
  process.exit(1);
}
const out = join(root, 'variants', 'molique-site', 'src', 'assets', 'ai');
mkdirSync(out, { recursive: true });

let total = 0;
for (const file of readdirSync(src).filter((f) => f.toLowerCase().endsWith('.png'))) {
  const { name } = parse(file);
  const meta = await sharp(join(src, file)).metadata();
  const landscape = (meta.width ?? 0) >= (meta.height ?? 0);
  const dest = join(out, `${name}.webp`);
  await sharp(join(src, file))
    .resize({ width: landscape ? 1920 : 1280, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(dest);
  const kb = Math.round(statSync(dest).size / 1024);
  total += kb;
  console.log(`${name.padEnd(18)} ${meta.width}x${meta.height}  ->  ${kb} KB`);
}
console.log(`Total: ${total} KB`);
