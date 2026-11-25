// Starts one variant's Astro dev server from inside that variant's folder.
// Usage: node variants/run.mjs <screwfast|astrowind>
// (Some templates resolve files relative to the working directory, so we chdir first.)
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const name = process.argv[2];
if (!name) {
  console.error('Usage: node variants/run.mjs <variant-folder-name>');
  process.exit(1);
}

const dir = join(dirname(fileURLToPath(import.meta.url)), name);
const astro = join(dir, 'node_modules', 'astro', 'bin', 'astro.mjs');

process.chdir(dir);
process.argv = [process.argv[0], astro, 'dev'];
await import(pathToFileURL(astro).href);
