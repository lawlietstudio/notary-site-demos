// Prepares variants/audit-pro: the "IT Audit Pro" Astro theme by Cory Trimm, adapted to the notary content.
//
// The theme has no licence file, so its source is deliberately NOT stored in this repository.
// Instead this script fetches it from the author's repository at a pinned commit, removes the
// audit-platform pages and components we don't use, and lays our own files (overlays/audit-pro)
// on top. What remains from the theme is its stylesheet and design tokens (src/styles/global.css);
// every page, component and the dependency list are our own.
//
// Usage: node scripts/prepare-audit.mjs      (safe to run repeatedly)
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'https://github.com/ctrimm/astro-audit-pro-theme.git';
const SHA = '59fc4c2705c06e93a295ad6c5cf351d7b0d64213';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'variants', 'audit-pro');
const overlay = join(root, 'overlays', 'audit-pro');

const git = (args, cwd = root) => {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} failed:\n${r.stderr}`);
  return r.stdout.trim();
};

// 1. Fetch the theme at the pinned commit
if (!existsSync(join(dir, '.git'))) {
  mkdirSync(join(root, 'variants'), { recursive: true });
  console.log('Cloning theme...');
  git(['clone', '--quiet', REPO, dir]);
}
if (git(['rev-parse', 'HEAD'], dir) !== SHA) {
  console.log(`Checking out pinned commit ${SHA.slice(0, 7)}...`);
  git(['checkout', '--quiet', '--force', SHA], dir);
}

// 2. Remove the audit-platform content we don't use (this folder is a disposable build copy)
for (const p of ['src/pages', 'src/components', 'src/layouts', 'src/lib', 'public', 'package-lock.json', 'astro.config.mjs', 'preview.png', 'screenshot.png', '.github']) {
  rmSync(join(dir, p), { recursive: true, force: true });
}

// 3. Our own files on top (pages, components, layout, package.json and lockfile)
cpSync(overlay, dir, { recursive: true, force: true });

// 4. Shared content, photographs and logo
mkdirSync(join(dir, 'src', 'data'), { recursive: true });
cpSync(join(root, 'content', 'site.json'), join(dir, 'src', 'data', 'site.json'));
mkdirSync(join(dir, 'src', 'assets', 'photos'), { recursive: true });
for (const f of readdirSync(join(root, 'photos')).filter((n) => n.endsWith('.jpg'))) {
  cpSync(join(root, 'photos', f), join(dir, 'src', 'assets', 'photos', f));
}
mkdirSync(join(dir, 'public'), { recursive: true });
cpSync(join(root, 'logo', 'favicon.svg'), join(dir, 'public', 'favicon.svg'));

console.log('variants/audit-pro is ready. Next: npm ci --ignore-scripts (inside that folder).');
