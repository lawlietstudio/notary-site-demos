import { defineArrayMember, defineField, defineType } from 'sanity';

const ls = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'localizedString', description, validation: (r) => r.required() });

const lt = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'localizedText', description });

const str = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'string', description, validation: (r) => r.required() });

const time = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description: '24-hour time, e.g. 07:00 or 19:00',
    validation: (r) => r.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: 'HH:MM' }),
  });

// Field names match the keys in content/site.json, so the site reads Sanity and the JSON fallback the same way.

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    str('name', 'Business name'),
    defineField({
      name: 'siteUrl',
      title: 'Website address',
      type: 'url',
      description: 'Your real domain, e.g. https://www.yourdomain.com. Used for search engines and the sitemap.',
      validation: (r) => r.required().uri({ scheme: ['https'] }),
    }),
    str('phone', 'Phone'),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.required().email() }),
    defineField({
      name: 'bookingUrl',
      title: 'Online booking link (optional)',
      type: 'url',
      description: 'e.g. a Calendly or Acuity page. If set, every "Book an Appointment" button goes there; otherwise to the Contact page.',
    }),
    defineField({
      name: 'formEndpoint',
      title: 'Contact form endpoint (optional)',
      type: 'url',
      description: 'A form service URL (Formspree, Basin, …). If empty, the form opens the visitor’s email app instead.',
    }),
    str('homeTitle', 'Home page title', 'Shown in the browser tab and search results after the business name.'),
    defineField({
      name: 'metaDescription',
      title: 'Search result description',
      type: 'text',
      rows: 3,
      description: 'Around 150 characters. Shown under your link in Google.',
      validation: (r) => r.required().max(160).warning('Longer than 160 characters may be cut off in search results.'),
    }),
    defineField({
      name: 'hours',
      title: 'Opening hours',
      type: 'object',
      fields: [ls('label', 'Text shown on the site', 'e.g. 7 am – 7 pm, 7 days a week'), time('opens', 'Opens'), time('closes', 'Closes')],
    }),
    defineField({
      name: 'cta',
      title: 'Button labels',
      type: 'object',
      fields: [ls('book', 'Book an appointment'), ls('pricing', 'See prices')],
    }),
  ],
});

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Top banner',
      type: 'object',
      fields: [ls('eyebrow', 'Small line above the heading'), ls('title', 'Heading'), lt('lead', 'Subheading')],
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'object',
      description: 'Also shown on the Pricing page as "Common documents".',
      fields: [
        ls('title', 'Section heading'),
        defineField({ name: 'items', title: 'Services', type: 'array', of: [defineArrayMember({ type: 'serviceItem' })] }),
      ],
    }),
    defineField({
      name: 'why',
      title: 'Why choose us',
      type: 'object',
      fields: [
        ls('title', 'Section heading'),
        defineField({ name: 'items', title: 'Reasons', type: 'array', of: [defineArrayMember({ type: 'whyItem' })] }),
      ],
    }),
    defineField({
      name: 'ctaBand',
      title: 'Booking banner',
      type: 'object',
      fields: [ls('title', 'Heading'), lt('text', 'Text')],
    }),
  ],
});

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    ls('title', 'Page heading'),
    defineField({ name: 'intro', title: 'Introduction paragraphs', type: 'array', of: [defineArrayMember({ type: 'localizedText' })] }),
    defineField({ name: 'area', title: 'Service area', type: 'object', fields: [ls('title', 'Heading'), lt('text', 'Text')] }),
    defineField({
      name: 'person',
      title: 'About the notary',
      type: 'object',
      fields: [
        ls('title', 'Heading'),
        defineField({ name: 'paragraphs', title: 'Paragraphs', type: 'array', of: [defineArrayMember({ type: 'localizedText' })] }),
      ],
    }),
    defineField({
      name: 'credentials',
      title: 'Education and credentials',
      type: 'object',
      fields: [
        ls('title', 'Heading'),
        defineField({ name: 'items', title: 'List', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
      ],
    }),
  ],
});

export const pricingPage = defineType({
  name: 'pricingPage',
  title: 'Pricing page',
  type: 'document',
  fields: [
    ls('title', 'Page heading'),
    ls('payment', 'Payment methods', 'e.g. Cash or e-transfer only'),
    defineField({ name: 'plans', title: 'Price plans', type: 'array', of: [defineArrayMember({ type: 'planItem' })] }),
    ls('planCta', 'Plan button label'),
    ls('examplesTitle', 'Heading above the document list'),
  ],
});

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  fields: [
    ls('title', 'Page heading'),
    ls('hoursTitle', 'Business hours heading'),
    lt('hoursNote', 'Note under the hours', 'e.g. cancellation policy'),
    ls('days', 'Days open', 'e.g. Monday – Sunday'),
    ls('stepsTitle', 'How it works: heading'),
    defineField({ name: 'steps', title: 'How it works: steps', type: 'array', of: [defineArrayMember({ type: 'stepItem' })] }),
    defineField({
      name: 'form',
      title: 'Contact form labels',
      type: 'object',
      fields: [
        ls('title', 'Form heading'),
        str('first', 'First name label'),
        str('last', 'Last name label'),
        str('email', 'Email label'),
        str('phone', 'Phone label'),
        str('subject', 'Subject label'),
        str('message', 'Message label'),
        str('consent', 'Consent checkbox text'),
        str('submit', 'Send button text'),
        str('success', 'Message shown after sending'),
      ],
    }),
    ls('directTitle', 'Heading above phone and email'),
  ],
});

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy policy',
  type: 'document',
  fields: [
    str('title', 'Page heading'),
    defineField({ name: 'lastUpdated', title: 'Last updated', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'intro', title: 'Introduction', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', of: [defineArrayMember({ type: 'privacySection' })] }),
  ],
});
