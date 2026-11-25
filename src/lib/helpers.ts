import type { L, Site } from './types';

/** Plain English text of a string or {en, zh} pair (for <title>, meta, JSON-LD). */
export const en = (t: L | undefined): string => (typeof t === 'string' ? t : t?.en ?? '');

/** A tel: link. Keeps a leading + if you typed one; otherwise dials the digits as written. */
export const telHref = (phone: string): string => 'tel:' + phone.replace(/[^\d+]/g, '');

/** Where "Book an Appointment" goes: your booking tool if set, otherwise the contact page. */
export const bookHref = (site: Site): string => site.bookingUrl || '/contact/';

export const isExternal = (href: string): boolean => /^https?:\/\//i.test(href);

/** Deployment sub-path without a trailing slash ('' when served from the domain root). */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefix a root-relative path ("/pricing/") with the deployment base. Leaves other URLs alone. */
export const withBase = (href: string): string =>
  href.startsWith('/') && !href.startsWith('//') ? `${BASE}${href}` : href;
