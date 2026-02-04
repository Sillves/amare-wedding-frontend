import type { WeddingWebsite, WebsiteContent, WebsiteSettings } from '@/features/website/types';

const DEMO_WEBSITE_CONTENT_FR: WebsiteContent = {
  hero: {
    coupleNames: 'Marie & Pierre',
    date: '2026-09-05',
    tagline: 'Nous allons nous marier!',
    displayStyle: 'centered',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
  },
  story: {
    enabled: true,
    title: 'Notre Histoire',
    displayType: 'timeline',
    items: [
      {
        id: 'story-1',
        date: '2018-07-14',
        title: 'Notre Rencontre',
        description: 'Nous nous sommes rencontrés lors d\'un bal du 14 juillet à Paris. Ce fut le coup de foudre.',
        imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
      },
      {
        id: 'story-2',
        date: '2024-02-14',
        title: 'La Demande',
        description: 'Pierre a demandé Marie en mariage au sommet de la Tour Eiffel le jour de la Saint-Valentin.',
        imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80',
      },
    ],
  },
  details: {
    enabled: true,
    title: 'Informations',
    ceremony: {
      enabled: true,
      title: 'Cérémonie',
      venue: 'Chapelle du Château',
      address: 'Château de Fontainebleau, Seine-et-Marne',
      date: '2026-09-05T15:00:00',
      description: 'Rejoignez-nous pour la cérémonie dans la chapelle historique.',
      mapUrl: '',
    },
    reception: {
      enabled: true,
      title: 'Réception',
      venue: 'La Grande Galerie',
      address: 'Château de Fontainebleau, Seine-et-Marne',
      date: '2026-09-05T18:00:00',
      description: 'Dîner et danse dans la magnifique galerie du château.',
      mapUrl: '',
    },
  },
  events: {
    enabled: true,
    title: 'Programme',
    showFromWeddingEvents: true,
  },
  gallery: {
    enabled: true,
    title: 'Galerie',
    displayType: 'grid',
    images: [
      {
        id: 'gallery-1',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
        caption: 'Nos fiançailles',
      },
      {
        id: 'gallery-2',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        caption: 'Ensemble pour toujours',
      },
      {
        id: 'gallery-3',
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
        caption: 'L\'amour en fleurs',
      },
      {
        id: 'gallery-4',
        url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80',
        caption: 'Une journée parfaite',
      },
      {
        id: 'gallery-5',
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
        caption: 'Beaux moments',
      },
      {
        id: 'gallery-6',
        url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80',
        caption: 'Célébration d\'amour',
      },
    ],
  },
  rsvp: {
    enabled: true,
    title: 'RSVP',
    description: 'Merci de confirmer votre présence avant le 5 août 2026',
    deadline: '2026-08-05',
  },
  footer: {
    enabled: true,
    contactEmail: 'marie.pierre@example.fr',
    customMessage: 'Nous avons hâte de célébrer avec vous!',
  },
  eventCustomizations: [],
};

const DEMO_WEBSITE_SETTINGS_FR: WebsiteSettings = {
  templateSettings: {
    primaryColor: '#8B7355',
    accentColor: '#D4AF37',
    fontFamily: 'serif',
    backgroundPattern: 'damask',
    colorScheme: 'bronsgoud',
  },
};

export const DEMO_WEBSITE_FR: WeddingWebsite = {
  id: 'demo-website',
  weddingId: 'demo',
  template: 0, // ElegantClassic
  content: DEMO_WEBSITE_CONTENT_FR,
  settings: DEMO_WEBSITE_SETTINGS_FR,
  isPublished: true,
  publishedAt: '2026-01-15T00:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-31T00:00:00Z',
};
