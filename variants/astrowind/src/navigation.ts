import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'Price Plans', href: getPermalink('/pricing') },
    { text: 'Contact', href: getPermalink('/contact') },
  ],
  actions: [{ text: "Book an Appointment", href: getPermalink('/contact') }],
};

export const footerData = {
  links: [
    {
      title: 'Explore',
      links: [
        { text: 'Home', href: getPermalink('/') },
        { text: 'Price Plans', href: getPermalink('/pricing') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Contact us',
      links: [
        { text: "000-000-0000", href: "tel:0000000000" },
        { text: "hello@example.com", href: "mailto:hello@example.com" },
        { text: "7 am – 7 pm, 7 days a week", href: getPermalink('/contact') },
      ],
    },
  ],
  secondaryLinks: [{ text: 'Privacy Policy', href: getPermalink('/privacy') }],
  socialLinks: [],
  footNote: `© ${new Date().getFullYear()} Sample Mobile Notary`,
};
