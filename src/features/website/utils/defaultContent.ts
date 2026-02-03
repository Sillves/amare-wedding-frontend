import type { WebsiteContent, WebsiteSettings, WebsiteTemplate } from '../types';
import { WebsiteTemplateNames } from '../types';

/**
 * Translation function type for getDefaultContent
 * @param key - Translation key (e.g., 'defaults.hero.tagline')
 * @returns Translated string
 */
type TranslationFn = (key: string) => string;

/**
 * Get default localized content for a new wedding website
 * @param coupleNames - Names of the couple
 * @param weddingDate - Wedding date string
 * @param weddingLocation - Wedding location
 * @param t - Translation function from useTranslation('website')
 */
export function getDefaultContent(
  coupleNames: string,
  weddingDate: string,
  weddingLocation: string,
  t?: TranslationFn
): WebsiteContent {
  const date = new Date(weddingDate);
  const deadlineDate = new Date(date);
  deadlineDate.setMonth(deadlineDate.getMonth() - 1);

  // Use translations if available, otherwise fallback to English defaults
  // Ensure fallback is used if translation returns undefined or the key itself
  const translate = (key: string, fallback: string): string => {
    if (!t) return fallback;
    const translated = t(key);
    // Check if translation was found (not empty, not the key, not key with namespace prefix)
    if (!translated) return fallback;
    if (translated === key) return fallback;
    if (translated.includes(key)) return fallback; // Handles "namespace:key" returns
    return translated;
  };

  return {
    hero: {
      coupleNames,
      date: weddingDate,
      tagline: translate('defaults.hero.tagline', "We're getting married!"),
      displayStyle: 'centered',
    },
    story: {
      enabled: true,
      title: translate('defaults.story.title', 'Our Story'),
      displayType: 'timeline',
      items: [],
    },
    details: {
      enabled: true,
      title: translate('defaults.details.title', 'Wedding Details'),
      ceremony: {
        enabled: true,
        title: translate('defaults.details.ceremony', 'Ceremony'),
        venue: '',
        address: weddingLocation,
        date: weddingDate,
        description: '',
        mapUrl: '',
      },
      reception: {
        enabled: true,
        title: translate('defaults.details.reception', 'Reception'),
        venue: '',
        address: '',
        date: weddingDate,
        description: '',
        mapUrl: '',
      },
    },
    events: {
      enabled: true,
      title: translate('defaults.events.title', 'Schedule'),
      showFromWeddingEvents: true,
    },
    gallery: {
      enabled: true,
      title: translate('defaults.gallery.title', 'Gallery'),
      displayType: 'grid',
      images: [],
    },
    rsvp: {
      enabled: true,
      title: translate('defaults.rsvp.title', 'RSVP'),
      description: translate('defaults.rsvp.description', 'Please let us know if you can attend'),
      deadline: deadlineDate.toISOString().split('T')[0],
    },
    footer: {
      enabled: true,
      contactEmail: '',
      customMessage: translate('defaults.footer.message', "We can't wait to celebrate with you!"),
    },
  };
}

export function getDefaultSettings(template: WebsiteTemplate): WebsiteSettings {
  // Use string keys for the settings lookup
  const templateSettings: Record<string, WebsiteSettings['templateSettings']> = {
    ElegantClassic: {
      primaryColor: '#4A4A4A',
      accentColor: '#BDB2A7',
      fontFamily: 'serif',
      backgroundPattern: 'none',
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

  // Convert numeric template to string name
  const templateName = WebsiteTemplateNames[template] || 'ElegantClassic';

  return {
    templateSettings: templateSettings[templateName],
  };
}

// Use string keys for template info (accessed via WebsiteTemplateNames)
export const TEMPLATE_INFO: Record<
  string,
  { name: string; description: string; previewImage: string }
> = {
  ElegantClassic: {
    name: 'Elegant Classic',
    description: 'Timeless design with serif fonts, champagne tones, and refined charcoal accents',
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
