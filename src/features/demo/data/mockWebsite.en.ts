import type { WeddingWebsite, WebsiteContent, WebsiteSettings } from '@/features/website/types';

const DEMO_WEBSITE_CONTENT_EN: WebsiteContent = {
  hero: {
    coupleNames: 'Emma & James',
    date: '2026-08-15',
    tagline: 'We are getting married!',
    displayStyle: 'centered',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
  },
  story: {
    enabled: true,
    title: 'Our Story',
    displayType: 'timeline',
    items: [
      {
        id: 'story-1',
        date: '2020-06-15',
        title: 'We Met',
        description: 'We first met at a friend\'s garden party in the Cotswolds. It was love at first sight.',
        imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
      },
      {
        id: 'story-2',
        date: '2022-12-24',
        title: 'The Proposal',
        description: 'James proposed during a magical Christmas Eve walk through a snowy forest.',
        imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80',
      },
    ],
  },
  details: {
    enabled: true,
    title: 'Wedding Details',
    ceremony: {
      enabled: true,
      title: 'Ceremony',
      venue: 'St. Mary\'s Chapel',
      address: 'Willowbrook Manor, Cotswolds, England',
      date: '2026-08-15T14:00:00',
      description: 'Join us as we exchange our vows in the beautiful chapel garden.',
      mapUrl: '',
    },
    reception: {
      enabled: true,
      title: 'Reception',
      venue: 'The Grand Hall',
      address: 'Willowbrook Manor, Cotswolds, England',
      date: '2026-08-15T17:00:00',
      description: 'Dinner, dancing, and celebration in the manor\'s grand hall.',
      mapUrl: '',
    },
  },
  events: {
    enabled: true,
    title: 'Schedule',
    showFromWeddingEvents: true,
  },
  gallery: {
    enabled: true,
    title: 'Gallery',
    displayType: 'grid',
    images: [
      {
        id: 'gallery-1',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
        caption: 'Our engagement',
      },
      {
        id: 'gallery-2',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        caption: 'Together forever',
      },
      {
        id: 'gallery-3',
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
        caption: 'Love in bloom',
      },
      {
        id: 'gallery-4',
        url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80',
        caption: 'A perfect day',
      },
      {
        id: 'gallery-5',
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
        caption: 'Beautiful moments',
      },
      {
        id: 'gallery-6',
        url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80',
        caption: 'Celebration of love',
      },
    ],
  },
  rsvp: {
    enabled: true,
    title: 'RSVP',
    description: 'Please let us know if you can attend by July 15, 2026',
    deadline: '2026-07-15',
  },
  footer: {
    enabled: true,
    contactEmail: 'emma.james@example.com',
    customMessage: 'We can\'t wait to celebrate with you!',
  },
  eventCustomizations: [],
};

const DEMO_WEBSITE_SETTINGS_EN: WebsiteSettings = {
  templateSettings: {
    primaryColor: '#8B7355',
    accentColor: '#D4AF37',
    fontFamily: 'serif',
    backgroundPattern: 'damask',
    colorScheme: 'bronsgoud',
  },
};

export const DEMO_WEBSITE_EN: WeddingWebsite = {
  id: 'demo-website',
  weddingId: 'demo',
  template: 0, // ElegantClassic
  content: DEMO_WEBSITE_CONTENT_EN,
  settings: DEMO_WEBSITE_SETTINGS_EN,
  isPublished: true,
  publishedAt: '2026-01-15T00:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-31T00:00:00Z',
};
