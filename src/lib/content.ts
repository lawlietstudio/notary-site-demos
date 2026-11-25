// Loads the site content. Reads from Sanity when SANITY_PROJECT_ID is set, otherwise from
// content/site.json, so the site always builds, even before Sanity is connected.
import { createClient } from '@sanity/client';
import fallback from '../../content/site.json';
import type { Site } from './types';

type Raw = Record<string, unknown>;

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || 'production';
const base = fallback as unknown as Site & Raw;

// Which top-level Site keys each Sanity document provides.
const SETTINGS_KEYS = ['siteUrl', 'name', 'phone', 'email', 'bookingUrl', 'formEndpoint', 'homeTitle', 'metaDescription', 'hours', 'cta'];
const HOME_KEYS = ['hero', 'services', 'why', 'ctaBand'];

const QUERY = `{
  "siteSettings": *[_id == "siteSettings"][0],
  "homePage": *[_id == "homePage"][0],
  "aboutPage": *[_id == "aboutPage"][0],
  "pricingPage": *[_id == "pricingPage"][0],
  "contactPage": *[_id == "contactPage"][0],
  "privacyPage": *[_id == "privacyPage"][0]
}`;

/** Drop Sanity's document metadata (_id, _type, _rev, ...) so only content fields remain. */
const strip = (doc: Raw): Raw => Object.fromEntries(Object.entries(doc).filter(([k]) => !k.startsWith('_')));

const pick = (src: Raw, keys: string[]): Raw =>
  Object.fromEntries(keys.filter((k) => k in src).map((k) => [k, src[k]]));

function assemble(docs: Record<string, Raw | null>): Site {
  const missing: string[] = [];
  /** A published Sanity document if there is one, otherwise the matching part of site.json. */
  const use = (name: string, fromJson: () => Raw): Raw => {
    const doc = docs[name];
    if (doc) return strip(doc);
    missing.push(name);
    return fromJson();
  };

  const site = {
    ...use('siteSettings', () => pick(base, SETTINGS_KEYS)),
    ...use('homePage', () => pick(base, HOME_KEYS)),
    about: use('aboutPage', () => base.about as unknown as Raw),
    pricing: use('pricingPage', () => base.pricing as unknown as Raw),
    contact: use('contactPage', () => base.contact as unknown as Raw),
    privacy: use('privacyPage', () => base.privacy as unknown as Raw),
  };

  if (missing.length) {
    console.warn(`[content] Not in Sanity yet, using content/site.json for: ${missing.join(', ')}`);
  }
  return site as unknown as Site;
}

async function load(): Promise<Site> {
  if (!projectId) {
    console.warn('[content] SANITY_PROJECT_ID is not set, using content/site.json');
    return base;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-01-01',
    useCdn: false, // builds must see the latest published content
    perspective: 'published',
    token: import.meta.env.SANITY_API_READ_TOKEN || undefined,
  });

  try {
    return assemble(await client.fetch<Record<string, Raw | null>>(QUERY));
  } catch (err) {
    // Fail the build rather than silently publishing stale content.
    throw new Error(`[content] Could not read from Sanity project "${projectId}" (dataset "${dataset}"): ${(err as Error).message}`);
  }
}

let cached: Promise<Site> | undefined;

/** The site content. Cached for the whole build; re-fetched on every request in dev. */
export const getSite = (): Promise<Site> => {
  if (import.meta.env.DEV) return load();
  return (cached ??= load());
};
