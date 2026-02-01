import type { WeddingWebsite, WebsiteContent, WebsiteSettings } from '@/features/website/types';

const DEMO_WEBSITE_CONTENT_NL: WebsiteContent = {
  hero: {
    coupleNames: 'Sophie & Thomas',
    date: '2026-08-22',
    tagline: 'Wij gaan trouwen!',
    displayStyle: 'centered',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
  },
  story: {
    enabled: true,
    title: 'Ons Verhaal',
    displayType: 'timeline',
    items: [
      {
        id: 'story-1',
        date: '2019-04-27',
        title: 'Onze Ontmoeting',
        description: 'We ontmoetten elkaar tijdens Koningsdag in Amsterdam. Het was liefde op het eerste gezicht.',
        imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
      },
      {
        id: 'story-2',
        date: '2023-12-31',
        title: 'Het Aanzoek',
        description: 'Thomas vroeg Sophie ten huwelijk tijdens het vuurwerk op oudjaarsavond.',
        imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80',
      },
    ],
  },
  details: {
    enabled: true,
    title: 'Trouwdetails',
    ceremony: {
      enabled: true,
      title: 'Ceremonie',
      venue: 'Kasteel de Haar',
      address: 'Kasteellaan 1, Haarzuilens',
      date: '2026-08-22T14:00:00',
      description: 'We nodigen jullie uit om getuige te zijn van onze trouwgeloften.',
      mapUrl: '',
    },
    reception: {
      enabled: true,
      title: 'Receptie',
      venue: 'De Orangerie',
      address: 'Kasteel de Haar, Haarzuilens',
      date: '2026-08-22T17:00:00',
      description: 'Diner, dansen en feesten in de prachtige orangerie.',
      mapUrl: '',
    },
  },
  events: {
    enabled: true,
    title: 'Programma',
    showFromWeddingEvents: true,
  },
  gallery: {
    enabled: true,
    title: 'Galerij',
    displayType: 'grid',
    images: [
      {
        id: 'gallery-1',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
        caption: 'Onze verloving',
      },
      {
        id: 'gallery-2',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        caption: 'Voor altijd samen',
      },
      {
        id: 'gallery-3',
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
        caption: 'Liefde in bloei',
      },
      {
        id: 'gallery-4',
        url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80',
        caption: 'Een perfecte dag',
      },
      {
        id: 'gallery-5',
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
        caption: 'Mooie momenten',
      },
      {
        id: 'gallery-6',
        url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80',
        caption: 'Viering van liefde',
      },
    ],
  },
  rsvp: {
    enabled: true,
    title: 'RSVP',
    description: 'Laat ons weten of je erbij kunt zijn voor 22 juli 2026',
    deadline: '2026-07-22',
  },
  footer: {
    enabled: true,
    contactEmail: 'sophie.thomas@example.nl',
    customMessage: 'We kunnen niet wachten om met jullie te vieren!',
  },
};

const DEMO_WEBSITE_SETTINGS_NL: WebsiteSettings = {
  templateSettings: {
    primaryColor: '#8B7355',
    accentColor: '#D4AF37',
    fontFamily: 'serif',
    backgroundPattern: 'damask',
  },
};

export const DEMO_WEBSITE_NL: WeddingWebsite = {
  id: 'demo-website',
  weddingId: 'demo',
  template: 0, // ElegantClassic
  content: DEMO_WEBSITE_CONTENT_NL,
  settings: DEMO_WEBSITE_SETTINGS_NL,
  isPublished: true,
  publishedAt: '2026-01-15T00:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-31T00:00:00Z',
};
