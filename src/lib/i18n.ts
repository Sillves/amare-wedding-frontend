import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import nlCommon from '@/locales/nl/common.json';
import nlAuth from '@/locales/nl/auth.json';
import nlWeddings from '@/locales/nl/weddings.json';
import nlGuests from '@/locales/nl/guests.json';
import nlEvents from '@/locales/nl/events.json';
import nlBilling from '@/locales/nl/billing.json';
import nlProfile from '@/locales/nl/profile.json';
import nlLanding from '@/locales/nl/landing.json';
import nlExpenses from '@/locales/nl/expenses.json';
import nlDemo from '@/locales/nl/demo.json';
import nlSeo from '@/locales/nl/seo.json';
import nlWebsite from '@/locales/nl/website.json';

import enCommon from '@/locales/en/common.json';
import enAuth from '@/locales/en/auth.json';
import enWeddings from '@/locales/en/weddings.json';
import enGuests from '@/locales/en/guests.json';
import enEvents from '@/locales/en/events.json';
import enBilling from '@/locales/en/billing.json';
import enProfile from '@/locales/en/profile.json';
import enLanding from '@/locales/en/landing.json';
import enExpenses from '@/locales/en/expenses.json';
import enDemo from '@/locales/en/demo.json';
import enSeo from '@/locales/en/seo.json';
import enWebsite from '@/locales/en/website.json';

import frCommon from '@/locales/fr/common.json';
import frAuth from '@/locales/fr/auth.json';
import frWeddings from '@/locales/fr/weddings.json';
import frGuests from '@/locales/fr/guests.json';
import frEvents from '@/locales/fr/events.json';
import frBilling from '@/locales/fr/billing.json';
import frProfile from '@/locales/fr/profile.json';
import frLanding from '@/locales/fr/landing.json';
import frExpenses from '@/locales/fr/expenses.json';
import frDemo from '@/locales/fr/demo.json';
import frSeo from '@/locales/fr/seo.json';
import frWebsite from '@/locales/fr/website.json';

const resources = {
  nl: {
    common: nlCommon,
    auth: nlAuth,
    weddings: nlWeddings,
    guests: nlGuests,
    events: nlEvents,
    billing: nlBilling,
    profile: nlProfile,
    landing: nlLanding,
    expenses: nlExpenses,
    demo: nlDemo,
    seo: nlSeo,
    website: nlWebsite,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    weddings: enWeddings,
    guests: enGuests,
    events: enEvents,
    billing: enBilling,
    profile: enProfile,
    landing: enLanding,
    expenses: enExpenses,
    demo: enDemo,
    seo: enSeo,
    website: enWebsite,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    weddings: frWeddings,
    guests: frGuests,
    events: frEvents,
    billing: frBilling,
    profile: frProfile,
    landing: frLanding,
    expenses: frExpenses,
    demo: frDemo,
    seo: frSeo,
    website: frWebsite,
  },
};

i18n
  .use(LanguageDetector) // Detecteert browser taal
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'nl', // Nederlands als fallback
    defaultNS: 'common',
    ns: ['common', 'auth', 'weddings', 'guests', 'events', 'billing', 'profile', 'landing', 'expenses', 'demo', 'seo', 'website'],
    interpolation: {
      escapeValue: false, // React escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
