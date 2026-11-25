import { defineField, defineType } from 'sanity';

// English + optional second language. Leave 中文 empty to show English only.
export const localizedString = defineType({
  name: 'localizedString',
  title: 'Text (English / 中文)',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'zh', title: '中文 (optional)', type: 'string' }),
  ],
  preview: { select: { title: 'en', subtitle: 'zh' } },
});

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Paragraph (English / 中文)',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'zh', title: '中文 (optional)', type: 'text', rows: 3 }),
  ],
  preview: { select: { title: 'en', subtitle: 'zh' } },
});

export const serviceItem = defineType({
  name: 'serviceItem',
  title: 'Service',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'localizedString', validation: (r) => r.required() }),
    defineField({ name: 'example', title: 'Example', type: 'localizedText', description: 'One line, e.g. "Such as…"' }),
  ],
  preview: { select: { title: 'name.en', subtitle: 'example.en' } },
});

export const whyItem = defineType({
  name: 'whyItem',
  title: 'Reason',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'localizedString', validation: (r) => r.required() }),
    defineField({ name: 'text', title: 'Text', type: 'localizedText' }),
  ],
  preview: { select: { title: 'title.en', subtitle: 'text.en' } },
});

export const stepItem = defineType({
  name: 'stepItem',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'localizedString', validation: (r) => r.required() }),
    defineField({ name: 'text', title: 'Text', type: 'localizedText' }),
  ],
  preview: { select: { title: 'title.en', subtitle: 'text.en' } },
});

export const planItem = defineType({
  name: 'planItem',
  title: 'Price plan',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Plan name', type: 'localizedString', validation: (r) => r.required() }),
    defineField({ name: 'price', title: 'Price', type: 'string', description: 'Shown as typed, e.g. $40', validation: (r) => r.required() }),
    defineField({ name: 'unit', title: 'Unit (optional)', type: 'localizedString', description: 'e.g. "each"' }),
    defineField({ name: 'desc', title: 'Description', type: 'localizedText' }),
    defineField({ name: 'featured', title: 'Highlight this plan', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'name.en', subtitle: 'price' } },
});

export const privacySection = defineType({
  name: 'privacySection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'text', title: 'Text', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'text' } },
});
