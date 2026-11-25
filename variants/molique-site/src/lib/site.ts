// Content of the existing Notary Public Mall website in English and Chinese
// (copied from the project's content/notarymall.json by scripts/prepare-molique.mjs).
import data from '../data/site.json';

// Loosely typed on purpose: this variant only reads the content.
export const site: any = data;

/** English text of a string or {en, zh} pair. */
export const en = (v: any): string => (typeof v === 'string' ? v : (v?.en ?? ''));

/** Chinese text of an {en, zh} pair ('' when there is none). */
export const zh = (v: any): string => (typeof v === 'string' ? '' : (v?.zh ?? ''));

/** Deployment sub-path without a trailing slash ('' at the domain root). */
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefix a root-relative path ("/pricing/") with the deployment base. */
export const withBase = (href: string): string =>
  href.startsWith('/') && !href.startsWith('//') ? `${BASE}${href}` : href;

export const telHref = (phone: string): string => 'tel:' + phone.replace(/[^\d+]/g, '');

export const nav: { href: string; label: { en: string; zh: string } }[] = site.nav;
