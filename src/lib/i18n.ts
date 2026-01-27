import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import nlCommon from '@/locales/nl/common.json';
import nlAuth from '@/locales/nl/auth.json';
import nlWeddings from '@/locales/nl/weddings.json';
import nlGuests from '@/locales/nl/guests.json';
import nlEvents from '@/locales/nl/events.json';

import enCommon from '@/locales/en/common.json';
import enAuth from '@/locales/en/auth.json';
import enWeddings from '@/locales/en/weddings.json';
import enGuests from '@/locales/en/guests.json';
import enEvents from '@/locales/en/events.json';

import frCommon from '@/locales/fr/common.json';
import frAuth from '@/locales/fr/auth.json';
import frWeddings from '@/locales/fr/weddings.json';
import frGuests from '@/locales/fr/guests.json';
import frEvents from '@/locales/fr/events.json';

const resources = {
  nl: {
    common: nlCommon,
    auth: nlAuth,
    weddings: nlWeddings,
    guests: nlGuests,
    events: nlEvents,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    weddings: enWeddings,
    guests: enGuests,
    events: enEvents,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    weddings: frWeddings,
    guests: frGuests,
    events: frEvents,
  },
};

i18n
  .use(LanguageDetector) // Detecteert browser taal
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'nl', // Nederlands als fallback
    defaultNS: 'common',
    ns: ['common', 'auth', 'weddings', 'guests', 'events'],
    interpolation: {
      escapeValue: false, // React escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
