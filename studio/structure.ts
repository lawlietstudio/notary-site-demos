import type { StructureResolver } from 'sanity/structure';

// One entry per page of the website. The document type name doubles as its fixed document ID,
// which is what the website's content loader looks for.
const pages = [
  { id: 'siteSettings', title: 'Site settings' },
  { id: 'homePage', title: 'Home page' },
  { id: 'aboutPage', title: 'About page' },
  { id: 'pricingPage', title: 'Pricing page' },
  { id: 'contactPage', title: 'Contact page' },
  { id: 'privacyPage', title: 'Privacy policy' },
];

export const singletonIds = new Set(pages.map((p) => p.id));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website')
    .items(
      pages.map(({ id, title }) =>
        S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title))
      )
    );
