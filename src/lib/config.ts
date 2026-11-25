// Fixed site structure. Editable content lives in Sanity (or content/site.json as a fallback).

export const locale = 'en-CA';
export const secondaryLang = 'zh-Hant';

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/pricing/', label: 'Price Plans' },
  { href: '/contact/', label: 'Contact' },
] as const;

/** Every indexable page, used for the sitemap. */
export const pagePaths = ['/', '/about/', '/pricing/', '/contact/', '/privacy/'] as const;

export const notFound = {
  title: { en: 'Page not found', zh: '找不到頁面' },
  text: { en: 'The page you were looking for does not exist.', zh: '您要找的頁面不存在。' },
  back: { en: 'Back to home', zh: '返回首頁' },
};
