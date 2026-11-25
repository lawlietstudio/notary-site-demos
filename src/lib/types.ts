/** A string, or an English + second-language pair. */
export type L = string | { en: string; zh?: string | null };

export interface Site {
  siteUrl: string;
  name: string;
  phone: string;
  email: string;
  bookingUrl?: string;
  formEndpoint?: string;
  homeTitle: string;
  metaDescription: string;
  hours: { label: L; opens: string; closes: string };
  cta: { book: L; pricing: L };

  hero: { eyebrow: L; title: L; lead: L };
  services: { title: L; items: ServiceItem[] };
  why: { title: L; items: { title: L; text: L }[] };
  ctaBand: { title: L; text: L };

  about: {
    title: L;
    intro: L[];
    area: { title: L; text: L };
    person: { title: L; paragraphs: L[] };
    credentials: { title: L; items: string[] };
  };

  pricing: {
    title: L;
    payment: L;
    plans: Plan[];
    planCta: L;
    examplesTitle: L;
  };

  contact: {
    title: L;
    hoursTitle: L;
    hoursNote: L;
    days: L;
    stepsTitle: L;
    steps: { title: L; text: L }[];
    form: {
      title: L;
      first: string;
      last: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
      consent: string;
      submit: string;
      success: string;
    };
    directTitle: L;
  };

  privacy: {
    title: string;
    lastUpdated: string;
    intro: string;
    sections: { title: string; text: string }[];
  };
}

export interface ServiceItem {
  name: L;
  example: L;
}

export interface Plan {
  name: L;
  price: string;
  unit?: L;
  desc: L;
  featured?: boolean;
}
