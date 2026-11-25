// Sample content in English and Traditional Chinese (copied from the project's
// content/molique-sample.json by scripts/prepare-molique.mjs). English lives at the site root,
// Chinese under /zh/.
import data from '../data/site.json';

// Loosely typed on purpose: this variant only reads the content.
export const site: any = data;

export type Lang = 'en' | 'zh';
export const LANGS: Lang[] = ['en', 'zh'];

/** Text of a string or an {en, zh} pair in the given language (falls back to English). */
export const t = (v: any, lang: Lang): string =>
  typeof v === 'string' ? v : (v?.[lang] ?? v?.en ?? '');

/** Language of the current request, from the optional `[...lang]` route parameter. */
export const langOf = (param: string | undefined): Lang => (param === 'zh' ? 'zh' : 'en');

/** Deployment sub-path without a trailing slash ('' at the domain root). */
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Root-relative path ("/pricing/") in a language, including the deployment base. */
export const href = (path: string, lang: Lang): string => `${BASE}${lang === 'zh' ? '/zh' : ''}${path}`;

/** Prefix a root-relative asset path with the deployment base. */
export const withBase = (p: string): string => (p.startsWith('/') && !p.startsWith('//') ? `${BASE}${p}` : p);

export const telHref = (phone: string): string => 'tel:' + phone.replace(/[^\d+]/g, '');

export const nav: { href: string; label: { en: string; zh: string } }[] = site.nav;
export const ui = (key: string, lang: Lang): string => t(site.ui[key], lang);
