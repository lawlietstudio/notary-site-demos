// Builds all three sites for GitHub Pages into _site/:
//
//   _site/index.html        landing page that links to the three sites
//   _site/custom/           the custom design (project root)
//   _site/screwfast/        variants/screwfast
//   _site/astrowind/        variants/astrowind
//   _site/audit/            variants/audit-pro (created by scripts/prepare-audit.mjs)
//   _site/molique/          variants/molique-site (built on the molique CSS framework)
//
// Run `node scripts/prepare-audit.mjs` first, and install dependencies in the root and in each
// variant folder.
//
// Environment:
//   SITE_ORIGIN  e.g. https://lawlietstudio.github.io   (default shown)
//   PAGES_BASE   path of the Pages site: "notary-site-demos" for a project site,
//                or "" when served from the root of a custom domain.
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '_site');

const origin = (process.env.SITE_ORIGIN || 'https://lawlietstudio.github.io').replace(/\/+$/, '');
const rawBase = process.env.PAGES_BASE === undefined ? 'notary-site-demos' : process.env.PAGES_BASE;
const pagesBase = rawBase.replace(/^\/+|\/+$/g, '') ? `/${rawBase.replace(/^\/+|\/+$/g, '')}` : '';

function run(cmd, args, cwd, env = {}) {
  const r = spawnSync(cmd, args, { cwd, env: { ...process.env, ...env }, stdio: 'inherit', shell: true });
  if (r.status !== 0) throw new Error(`"${cmd} ${args.join(' ')}" failed in ${cwd}`);
}

function build(id, dir, extraEnv = {}) {
  const base = `${pagesBase}/${id}`;
  console.log(`\n=== ${id}: base ${base} ===`);
  rmSync(join(dir, 'dist'), { recursive: true, force: true });
  run('npx', ['astro', 'build'], dir, { SITE_ORIGIN: origin, BASE_PATH: base, PUBLIC_DEMO: '1', ...extraEnv });
  mkdirSync(join(out, id), { recursive: true });
  cpSync(join(dir, 'dist'), join(out, id), { recursive: true });
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// 1. custom design (project root)
build('custom', root);

// 2. ScrewFast
build('screwfast', join(root, 'variants', 'screwfast'));

// 3. AstroWind reads its site URL, base path and robots setting from src/config.yaml,
//    so rewrite it for the build and always restore it afterwards.
{
  const dir = join(root, 'variants', 'astrowind');
  const cfgPath = join(dir, 'src', 'config.yaml');
  const original = readFileSync(cfgPath, 'utf8');
  try {
    const patched = original
      .replace(/^  site: '.*'$/m, `  site: '${origin}'`)
      .replace(/^  base: '.*'$/m, `  base: '${pagesBase}/astrowind/'`)
      .replace(/^(  robots:\n    index: )true(\n    follow: )true/m, '$1false$2false');
    if (patched === original) throw new Error('AstroWind config.yaml was not patched; pattern changed?');
    writeFileSync(cfgPath, patched);
    build('astrowind', dir);
  } finally {
    writeFileSync(cfgPath, original);
  }
}

// 4. IT Audit Pro design (prepared from the author's repository by scripts/prepare-audit.mjs)
build('audit', join(root, 'variants', 'audit-pro'));

// 5. molique design: sync the shared content and copy the framework files first
run('node', ['scripts/prepare-molique.mjs'], root);
build('molique', join(root, 'variants', 'molique-site'));

// 6. landing page, 404 page, and the marker that tells GitHub Pages not to run Jekyll
cpSync(join(root, 'deploy'), out, { recursive: true });
writeFileSync(join(out, '.nojekyll'), '');

console.log(`\nBuilt ${out}\nExpected URL: ${origin}${pagesBase}/`);
