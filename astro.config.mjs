import { defineConfig } from 'astro/config';

// Static output: the whole site is pre-built to dist/. When content changes in Sanity,
// a webhook triggers a rebuild on your host (see README).
//
// SITE_ORIGIN and BASE_PATH are only set for sub-path deployments such as GitHub Pages
// (e.g. SITE_ORIGIN=https://user.github.io BASE_PATH=/repo/custom). Locally they are unset.
export default defineConfig({
  site: process.env.SITE_ORIGIN || undefined,
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  server: { port: Number(process.env.PORT) || 4321 },
  devToolbar: { enabled: false },
});
