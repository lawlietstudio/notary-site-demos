import type { APIRoute } from 'astro';
import { getSite } from '../lib/content';
import { pagePaths } from '../lib/config';

export const GET: APIRoute = async () => {
  const site = await getSite();
  const base = site.siteUrl.replace(/\/$/, '');
  const urls = pagePaths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
