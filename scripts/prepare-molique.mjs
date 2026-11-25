// Prepares the molique-based variants (variants/molique-site = option E, variants/motion-site = option F):
// copies the shared content and the molique framework files (installed from npm into node_modules)
// to where each site serves them.
//
// molique is Apache-2.0. We ship its CSS, JS and fonts unmodified together with its LICENSE and
// NOTICE files (public/vendor/molique/). Run after `npm ci` inside each variant folder.
//
// Usage: node scripts/prepare-molique.mjs [molique-site|motion-site]   (default: both)
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const targets = process.argv[2] ? [process.argv[2]] : ['molique-site', 'motion-site'];

for (const name of targets) {
  const site = join(root, 'variants', name);
  const pkg = join(site, 'node_modules', 'molique');

  if (!existsSync(pkg)) {
    console.error(`molique is not installed. Run \`npm install --ignore-scripts\` in variants/${name} first.`);
    process.exit(1);
  }

  // Sample content in English and Traditional Chinese (content/molique-sample.json)
  mkdirSync(join(site, 'src', 'data'), { recursive: true });
  cpSync(join(root, 'content', 'molique-sample.json'), join(site, 'src', 'data', 'site.json'));

  // Framework runtime files, kept in their original folder layout (the CSS finds fonts at ../fonts)
  const out = join(site, 'public', 'vendor', 'molique');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(join(pkg, 'css', 'molique-style.min.css'), join(out, 'css', 'molique-style.min.css'));
  cpSync(join(pkg, 'js'), join(out, 'js'), { recursive: true });
  // The npm package of molique does not include its Poppins font files, but its CSS asks for
  // "../fonts/poppins-v24-latin[-ext]-<weight>.woff2". Supply the same open-source (OFL) Poppins
  // files from @fontsource under those names so molique's CSS works unmodified.
  const fontsOut = join(out, 'fonts');
  mkdirSync(fontsOut, { recursive: true });
  const poppins = join(site, 'node_modules', '@fontsource', 'poppins', 'files');
  for (const weight of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    for (const subset of ['latin', 'latin-ext']) {
      cpSync(join(poppins, `poppins-${subset}-${weight}-normal.woff2`), join(fontsOut, `poppins-v24-${subset}-${weight}.woff2`));
    }
  }
  // Logo favicon
  cpSync(join(root, 'logo', 'favicon.svg'), join(site, 'public', 'favicon.svg'));
  cpSync(join(pkg, 'LICENSE'), join(out, 'LICENSE'));
  cpSync(join(pkg, 'NOTICE'), join(out, 'NOTICE'));

  console.log(`variants/${name} is ready.`);
}
