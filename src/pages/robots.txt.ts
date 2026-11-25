import type { APIRoute } from 'astro';
import { getSite } from '../lib/content';

export const GET: APIRoute = async () => {
  const site = await getSite();
  const base = site.siteUrl.replace(/\/$/, '');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
