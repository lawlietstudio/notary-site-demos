// Shared content (copied from the project's content/site.json by scripts/prepare-molique.mjs).
import data from '../data/site.json';

// Loosely typed on purpose: this variant only reads the sample content.
export const site: any = data;

/** English text of a string or {en, zh} pair. */
export const en = (v: any): string => (typeof v === 'string' ? v : (v?.en ?? ''));

/** Deployment sub-path without a trailing slash ('' at the domain root). */
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefix a root-relative path ("/pricing/") with the deployment base. */
export const withBase = (href: string): string =>
  href.startsWith('/') && !href.startsWith('//') ? `${BASE}${href}` : href;

export const telHref = (phone: string): string => 'tel:' + phone.replace(/[^\d+]/g, '');

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Price Plans', href: '/pricing/' },
  { label: 'Contact', href: '/contact/' },
];

export const faqs = [
  { q: 'What should I bring to my appointment?', a: 'Bring valid government-issued photo ID and your document. Do not sign it beforehand: you will sign in front of the notary.' },
  { q: 'Do you come to me?', a: en(site.why.items[0].text) },
  {
    q: 'How much does it cost?',
    a: `${en(site.pricing.plans[0].desc)} is ${site.pricing.plans[0].price}. Each additional signature and seal is ${site.pricing.plans[1].price} up to the 10th, then ${site.pricing.plans[2].price} each. ${en(site.pricing.payment)}.`,
  },
  { q: 'Can you give legal advice?', a: en(site.about.person.paragraphs[1]) },
  { q: 'What if I need to cancel?', a: en(site.contact.hoursNote) },
];
