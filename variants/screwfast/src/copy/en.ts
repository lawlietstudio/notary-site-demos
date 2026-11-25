import faqs from '@data/faqs.json';
import features from '@data/features.json';
import pricing from '@data/pricing.json';

/**
 * English copy table. This file defines the shape every other locale must
 * satisfy (see `Copy` in `./index.ts`), so a missing translation fails
 * `astro check` instead of leaking English onto a localised page.
 *
 * Paths are unlocalised (`/products`, not `/fr/products`); callers run them
 * through `localePath()` from `@utils/locale`.
 */
export const en = {
  site: {
    description: "Affordable mobile notary services that come to your home, office or a location of your choice. Same-day appointments available, 7 days a week.",
    descriptionShort: "Affordable mobile notary services that come to your home, office or a location of your choice.",
    ogTitle: "Sample Mobile Notary: Mobile Notary Public Services",
    ogDescription: "Affordable mobile notary services that come to your home, office or a location of your choice. Same-day appointments available, 7 days a week.",
  },

  layout: {
    skipToContent: 'Skip to content',
    changeLanguage: 'Change language',
    toggleNavigation: 'Toggle navigation',
    darkTheme: 'Dark Theme Toggle',
    lightTheme: 'Light Theme Toggle',
    toggleTheme: 'Toggle theme',
  },

  nav: {
    /** Labels for `navLinks` in `@data/navigation`, keyed by id. */
    labels: { home: 'Home', services: 'Services', contact: 'Contact' },
    footer: {
      sectionTitles: { explore: 'Explore', contact: 'Contact us' },
      links: { home: 'Home', services: 'Services', contact: 'Contact' },
      hoursTitle: 'Hours',
    },
    /** Text for the optional mega menu (`@data/mega_link`). */
    megaMenu: {
      services: {
        guides: {
          title: 'Explore Advice and Explanations',
          description:
            "Dive deep into helpful guides and explanations for all of ScrewFast's features",
        },
        integrations: {
          title: 'Discover Integrations',
          description:
            'Supercharge Your Workflow. Seamless integrations with all your favorite tools',
        },
        experts: {
          title: 'Expert Services',
          description: "Go beyond tools with ScrewFast's expert services",
        },
        tools: {
          title: 'Cutting-Edge Tools',
          description:
            "Build Smarter, Faster. Experience next-level efficiency with ScrewFast's cutting-edge construction tools",
        },
        plans: {
          title: 'Simple Plans',
          description:
            "Boost your efficiency with ScrewFast's straightforward, value-driven plans",
        },
        community: {
          title: 'Community Forum',
          description: 'Learn, share, and connect with other ScrewFast users',
        },
      },
      successStories: 'Success Stories',
      successStory: {
        description:
          'See how ScrewFast has empowered businesses of all sizes to achieve outstanding results.',
        imageAlt: 'Portrait of a smiling person',
      },
      learnMore: 'Learn more',
    },
  },

  forms: {
    email: 'Email',
    emailAddress: 'Email address',
    emailPlaceholder: 'Enter your email',
    emailInvalid:
      'Please include a valid email address so we can get back to you',
    subscribe: 'Subscribe',
    phone: 'Phone Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot password?',
    passwordHint: '8+ characters required',
    passwordMismatch: 'Password does not match the password',
    rememberMe: 'Remember me',
    acceptTerms: 'I accept the ',
    termsAndConditions: 'Terms and Conditions',
    or: 'Or',
    demoFallbackMessage: 'Demo only — this form is not connected to a backend.',
  },

  auth: {
    logIn: 'Log in',
    signIn: 'Sign in',
    signUp: 'Sign up',
    signInWithGoogle: 'Sign in with Google',
    signUpWithGoogle: 'Sign up with Google',
    noAccountYet: "Don't have an account yet?",
    signUpHere: 'Sign up here',
    alreadyHaveAccount: 'Already have an account?',
    signInHere: 'Sign in here',
    forgotPasswordTitle: 'Forgot password?',
    rememberYourPassword: 'Remember your password?',
    resetPassword: 'Reset password',
    credentialsDemoNotice:
      'Demo only – connect a real auth provider before collecting credentials.',
    recoveryDemoNotice:
      'Demo only – password recovery is not connected to a backend.',
    signInDemoMessage: 'Demo only – sign-in is not connected to a backend.',
    registerDemoMessage:
      'Demo only – registration is not connected to a backend.',
    recoverDemoMessage:
      'Demo only – password recovery is not connected to a backend.',
  },

  share: {
    share: 'Share',
    shareOn: (platform: string) => `Share on ${platform}`,
    copied: 'Copied',
    copyLink: 'Copy link',
  },

  banner: {
    dismiss: 'Dismiss',
    region: 'Informational banner',
  },

  blog: {
    readMore: 'Read More',
    minRead: (minutes: number) => `${minutes} min read`,
    relatedArticles: 'Related articles',
    wasHelpful: 'Was this post helpful?',
    yes: 'Yes',
    no: 'No',
    ogSection: 'Blog',
  },

  insights: {
    readMore: 'Read more',
    tableOfContents: 'Table of Contents:',
    ogSection: 'Insights',
  },

  products: {
    ogSection: 'Hardware Tools',
    tabs: 'Tabs',
  },

  notFound: {
    title: 'Page Not Found',
    subTitle: "We couldn't find that page.",
    content: 'It may have moved. Head back to the home page or get in touch to book an appointment.',
    goHome: 'Go Home',
    goBack: 'Go Back',
  },


  home: {
    banner: "Same-day appointments available. 7 am – 7 pm, 7 days a week",
    hero: {
      title: "Notary services that <span class=\"text-yellow-500 dark:text-yellow-400\">come to you</span>",
      subTitle: "Fast, efficient mobile service for all your legal documents.",
      primaryBtn: "Book an Appointment",
      secondaryBtn: "See Prices",
      rating: '',
      reviews: '',
      imageAlt: 'A hand signing a document with a pen on a wooden table',
    },
    clients: { title: '', subTitle: '' },
    featuresGeneral: {
      title: "Why choose us?",
      subTitle: "We provide reliable, professional mobile notary services. Our mission is to offer convenient and affordable notarization for individuals and businesses, handled with care and attention to detail.",
      imageAlt: 'Hands signing a document',
    },
    featuresNavs: {
      title: "What we notarize",
      tabs: {
        affidavits: {
          heading: "Affidavits and Statutory Declarations",
          content: "Such as affidavits of service, divorce or student-aid applications. Such as declarations of identity, marital status or progress payment.",
          alt: 'Forms and a pen on a wooden desk',
        },
        travel: {
          heading: "Travel Letters and Invitation Letters",
          content: "Such as consent letters for children travelling without both parents. Such as letters supporting a visitor's travel application.",
          alt: 'A dark passport',
        },
        claims: {
          heading: "Attestations and Insurance Claims",
          content: "Such as proof-of-life or residency attestations. Such as proof-of-loss forms.",
          alt: 'A red wax seal on paper',
        },
      },
    },
    testimonials: { title: '', subTitle: '', quotes: [], statistics: [] },
    faqTitle: 'Frequently<br />asked questions',
    heroAlt: {
      title: "Need a document notarized?",
      subTitle: "Appointments are by booking only. Tell us what you need and we will confirm a time.",
      btn: "Book an Appointment",
    },
  },

  services: {
    title: 'Services',
    metaDescription: "Notary services for affidavits, attestations, invitation letters, statutory declarations and more. 7 am – 7 pm, 7 days a week.",
    ogTitle: "Notary Services | Sample Mobile Notary",
    intro: {
      title: "Notary services that come to you",
      subTitle: "Fast, efficient mobile service for all your legal documents. We come to your home, office or a location of your choice.",
      cta: "Book an Appointment",
    },
    articles: {
      affidavits: {
        title: "Affidavits and Statutory Declarations",
        subTitle: "Such as affidavits of service, divorce or student-aid applications. Such as declarations of identity, marital status or progress payment. Bring valid photo ID and sign in front of the notary.",
        imageAlts: ['Forms and a pen on a wooden desk', 'Hands signing a document in black and white'],
      },
      claims: {
        title: "Attestations and Insurance Claims",
        subTitle: "Such as proof-of-life or residency attestations. Such as proof-of-loss forms. Each document is checked, signed and sealed during the visit.",
        imageAlts: ['A red wax seal on paper'],
        cta: "Book an Appointment",
      },
      travel: {
        title: "Travel Letters and Invitation Letters",
        subTitle: "Such as consent letters for children travelling without both parents. Such as letters supporting a visitor's travel application. Same-day appointments are available for urgent requests.",
        imageAlts: ['A dark passport'],
      },
      mobile: {
        title: "Convenient mobile service",
        subTitle: "We come to your home, office or a location of your choice. We proudly serve Sample City, Sample Town and the surrounding areas. Not sure if you are covered? Get in touch.",
        imageAlts: ['A wax-sealed envelope and a seal stamp', 'A notebook and pen on a desk by a window'],
        cta: "Book an Appointment",
      },
    },
    stats: {
      title: 'At a glance',
      subTitle: "By appointment only. Please cancel at least 24 hours in advance.",
      mainStatTitle: '7 days',
      mainStatSubTitle: "7 am – 7 pm, 7 days a week",
      stats: [
        { stat: "$40", description: "first notary signature and seal" },
        { stat: '24 h', description: 'notice for cancellations' },
        { stat: 'Same day', description: 'appointments for urgent requests' },
      ],
    },
  },

  contact: {
    title: 'Contact',
    metaDescription: "Book a mobile notary appointment with Sample Mobile Notary. 7 am – 7 pm, 7 days a week.",
    ogTitle: "Contact | Sample Mobile Notary",
    heading: "Contact and booking",
    subTitle: "Book online or contact us to arrange a convenient time. By appointment only. Please cancel at least 24 hours in advance.",
    formTitle: "Send us a message",
    formSubTitle: "By appointment only. Please cancel at least 24 hours in advance.",
    firstName: "First name",
    lastName: "Last name",
    details: "Your message",
    send: "Send message",
    demoMessage: "Thanks! Your email app should open with the message ready to send.",
    hoursHeading: "Business hours",
    hoursContent: "Monday – Sunday, 7 am – 7 pm, 7 days a week",
    stepsHeading: "How it works",
    stepsContent: "1. Schedule an appointment  2. Meet your notary  3. Document notarized",
    officeHeading: "Service area",
    officeContent: "We proudly serve Sample City, Sample Town and the surrounding areas. Not sure if you are covered? Get in touch.",
    emailHeading: 'Contact us directly',
    emailContent: 'Prefer to talk? Call or email:',
    phone: "000-000-0000",
    email: "hello@example.com",
  },

  /** Locale-specific JSON data (already the good pattern; kept as-is). */
  data: { faqs, features, pricing },
};
