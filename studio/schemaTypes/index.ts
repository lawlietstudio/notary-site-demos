import { aboutPage, contactPage, homePage, pricingPage, privacyPage, siteSettings } from './documents';
import { localizedString, localizedText, planItem, privacySection, serviceItem, stepItem, whyItem } from './objects';

export const schemaTypes = [
  // pages
  siteSettings,
  homePage,
  aboutPage,
  pricingPage,
  contactPage,
  privacyPage,
  // building blocks
  localizedString,
  localizedText,
  serviceItem,
  whyItem,
  stepItem,
  planItem,
  privacySection,
];
