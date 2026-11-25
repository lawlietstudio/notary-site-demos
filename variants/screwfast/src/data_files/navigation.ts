/**
 * Navigation structure: stable ids and unlocalised paths. Labels live in the
 * copy tables (`copy.nav.labels`, `copy.nav.footer.links`).
 */
export type NavLinkId = 'home' | 'services' | 'contact';

export const navLinks: { id: NavLinkId; path: string }[] = [
  { id: 'home', path: '/' },
  { id: 'services', path: '/services' },
  { id: 'contact', path: '/contact' },
];
