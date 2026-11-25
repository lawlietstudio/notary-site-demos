// Turns content/site.json into Sanity documents (studio/seed.ndjson) so you can load the
// current sample content into your Sanity project in one command:
//
//   npm run seed
//   cd studio && npx sanity dataset import seed.ndjson production --missing
//
// --missing only adds documents that don't exist yet, so it never overwrites edits made in the Studio.
import { readFileSync, writeFileSync } from 'node:fs';

const site = JSON.parse(readFileSync(new URL('../content/site.json', import.meta.url), 'utf8'));

// ---- helpers ----
const loc = (type) => (v) =>
  v == null ? undefined : { _type: type, ...(typeof v === 'string' ? { en: v } : v) };
const ls = loc('localizedString');
const lt = loc('localizedText');

/** Array of typed objects; Sanity needs a _key and _type on every item. */
const list = (items = [], type, fn) => items.map((item, i) => ({ _key: `${type}-${i + 1}`, _type: type, ...fn(item) }));
/** Array of localized paragraphs. */
const paras = (items = []) => items.map((p, i) => ({ _key: `p-${i + 1}`, ...lt(p) }));

/** Drop undefined and empty-string values so blank optional fields don't trip Sanity validation. */
const compact = (v) => {
  if (Array.isArray(v)) return v.map(compact);
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v)
        .filter(([, x]) => x !== undefined && x !== '')
        .map(([k, x]) => [k, compact(x)])
    );
  }
  return v;
};

// ---- documents (field names match the Studio schema in studio/schemaTypes) ----
const docs = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: site.name,
    siteUrl: site.siteUrl,
    phone: site.phone,
    email: site.email,
    bookingUrl: site.bookingUrl,
    formEndpoint: site.formEndpoint,
    homeTitle: site.homeTitle,
    metaDescription: site.metaDescription,
    hours: { label: ls(site.hours.label), opens: site.hours.opens, closes: site.hours.closes },
    cta: { book: ls(site.cta.book), pricing: ls(site.cta.pricing) },
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    hero: { eyebrow: ls(site.hero.eyebrow), title: ls(site.hero.title), lead: lt(site.hero.lead) },
    services: {
      title: ls(site.services.title),
      items: list(site.services.items, 'serviceItem', (s) => ({ name: ls(s.name), example: lt(s.example) })),
    },
    why: {
      title: ls(site.why.title),
      items: list(site.why.items, 'whyItem', (w) => ({ title: ls(w.title), text: lt(w.text) })),
    },
    ctaBand: { title: ls(site.ctaBand.title), text: lt(site.ctaBand.text) },
  },
  {
    _id: 'aboutPage',
    _type: 'aboutPage',
    title: ls(site.about.title),
    intro: paras(site.about.intro),
    area: { title: ls(site.about.area.title), text: lt(site.about.area.text) },
    person: { title: ls(site.about.person.title), paragraphs: paras(site.about.person.paragraphs) },
    credentials: { title: ls(site.about.credentials.title), items: site.about.credentials.items },
  },
  {
    _id: 'pricingPage',
    _type: 'pricingPage',
    title: ls(site.pricing.title),
    payment: ls(site.pricing.payment),
    plans: list(site.pricing.plans, 'planItem', (p) => ({
      name: ls(p.name),
      price: p.price,
      unit: ls(p.unit),
      desc: lt(p.desc),
      featured: Boolean(p.featured),
    })),
    planCta: ls(site.pricing.planCta),
    examplesTitle: ls(site.pricing.examplesTitle),
  },
  {
    _id: 'contactPage',
    _type: 'contactPage',
    title: ls(site.contact.title),
    hoursTitle: ls(site.contact.hoursTitle),
    hoursNote: lt(site.contact.hoursNote),
    days: ls(site.contact.days),
    stepsTitle: ls(site.contact.stepsTitle),
    steps: list(site.contact.steps, 'stepItem', (s) => ({ title: ls(s.title), text: lt(s.text) })),
    form: { ...site.contact.form, title: ls(site.contact.form.title) },
    directTitle: ls(site.contact.directTitle),
  },
  {
    _id: 'privacyPage',
    _type: 'privacyPage',
    title: site.privacy.title,
    lastUpdated: site.privacy.lastUpdated,
    intro: site.privacy.intro,
    sections: list(site.privacy.sections, 'privacySection', (s) => ({ title: s.title, text: s.text })),
  },
].map(compact);

const out = new URL('../studio/seed.ndjson', import.meta.url);
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`Wrote ${docs.length} documents to studio/seed.ndjson`);
