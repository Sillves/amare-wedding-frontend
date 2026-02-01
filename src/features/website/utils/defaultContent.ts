import type { WebsiteContent, WebsiteSettings, WebsiteTemplate } from '../types';

export function getDefaultContent(
  coupleNames: string,
  weddingDate: string,
  weddingLocation: string
): WebsiteContent {
  const date = new Date(weddingDate);
  const deadlineDate = new Date(date);
  deadlineDate.setMonth(deadlineDate.getMonth() - 1);

  return {
    hero: {
      coupleNames,
      date: weddingDate,
      tagline: "We're getting married!",
      displayStyle: 'centered',
    },
    story: {
      enabled: true,
      title: 'Our Story',
      displayType: 'timeline',
      items: [],
    },
    details: {
      enabled: true,
      title: 'Wedding Details',
      ceremony: {
        enabled: true,
        title: 'Ceremony',
        venue: '',
        address: weddingLocation,
        date: weddingDate,
        description: '',
        mapUrl: '',
      },
      reception: {
        enabled: true,
        title: 'Reception',
        venue: '',
        address: '',
        date: weddingDate,
        description: '',
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
      images: [],
    },
    rsvp: {
      enabled: true,
      title: 'RSVP',
      description: 'Please let us know if you can attend',
      deadline: deadlineDate.toISOString().split('T')[0],
    },
    footer: {
      enabled: true,
      contactEmail: '',
      customMessage: "We can't wait to celebrate with you!",
    },
  };
}

export function getDefaultSettings(template: WebsiteTemplate): WebsiteSettings {
  const templateSettings: Record<WebsiteTemplate, WebsiteSettings['templateSettings']> = {
    ElegantClassic: {
      primaryColor: '#8B7355',
      accentColor: '#D4AF37',
      fontFamily: 'serif',
      backgroundPattern: 'damask',
    },
    ModernMinimal: {
      primaryColor: '#1A1A1A',
      accentColor: '#E0E0E0',
      fontFamily: 'sans-serif',
      layoutDensity: 'spacious',
    },
    RomanticGarden: {
      primaryColor: '#8B4513',
      accentColor: '#FFB6C1',
      fontFamily: 'script',
      floralStyle: 'watercolor',
    },
  };

  return {
    templateSettings: templateSettings[template],
  };
}

export const TEMPLATE_INFO: Record<
  WebsiteTemplate,
  { name: string; description: string; previewImage: string }
> = {
  ElegantClassic: {
    name: 'Elegant Classic',
    description: 'Timeless design with serif fonts, soft neutrals, and gold accents',
    previewImage: '/templates/elegant-classic-preview.jpg',
  },
  ModernMinimal: {
    name: 'Modern Minimal',
    description: 'Clean lines, sans-serif fonts, and generous whitespace',
    previewImage: '/templates/modern-minimal-preview.jpg',
  },
  RomanticGarden: {
    name: 'Romantic Garden',
    description: 'Floral motifs, watercolor elements, and organic shapes',
    previewImage: '/templates/romantic-garden-preview.jpg',
  },
};
