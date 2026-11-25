import ogImageSrc from '@images/hero-signing.jpg';

export const SITE = {
  title: 'Sample Mobile Notary',
  tagline: 'Mobile notary services',
  description:
    'Affordable mobile notary services that come to your home, office or a location of your choice. Same-day appointments available, 7 days a week.',
  description_short: 'Affordable mobile notary services that come to you.',
  url: (import.meta.env.SITE ?? 'https://example.com').replace(/\/$/, ''),
  author: 'Sample Mobile Notary',
};

// Per-locale titles, descriptions and Open Graph text live in `src/copy/`;
// `src/utils/metadata.ts` assembles the <head> from them.
export const OG = {
  image: ogImageSrc,
};
