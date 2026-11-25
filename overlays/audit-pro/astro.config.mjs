import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// SITE_ORIGIN and BASE_PATH are only set for sub-path deployments (GitHub Pages).
export default defineConfig({
  site: process.env.SITE_ORIGIN || undefined,
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  server: { port: Number(process.env.PORT) || 4325 },
  devToolbar: { enabled: false },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
