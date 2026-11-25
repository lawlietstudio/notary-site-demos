import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_ORIGIN || 'https://example.com',
  base: process.env.BASE_PATH || '/',
  prefetch: true,
  integrations: [sitemap()],
  server: { port: Number(process.env.PORT) || 4323 },
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
