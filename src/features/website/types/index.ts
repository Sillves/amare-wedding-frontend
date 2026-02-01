import type { components } from '@/types/api';

/**
 * Auto-generated types from OpenAPI spec
 */

/**
 * Website Template enum - Auto-generated from OpenAPI
 * 0 = ElegantClassic, 1 = ModernMinimal, 2 = RomanticGarden
 */
export type WebsiteTemplate = components['schemas']['WebsiteTemplate'];

/**
 * Mapping from string template names to backend integer values
 */
export const WebsiteTemplateValues: Record<string, WebsiteTemplate> = {
  ElegantClassic: 0,
  ModernMinimal: 1,
  RomanticGarden: 2,
};

/**
 * Mapping from backend integer values to string template names
 */
export const WebsiteTemplateNames: Record<WebsiteTemplate, string> = {
  0: 'ElegantClassic',
  1: 'ModernMinimal',
  2: 'RomanticGarden',
};

/**
 * Wedding Website data transfer object - Auto-generated from OpenAPI
 */
export type WeddingWebsiteDto = components['schemas']['WeddingWebsiteDto'];

/**
 * Public Wedding Website data transfer object - Auto-generated from OpenAPI
 */
export type PublicWeddingWebsiteDto = components['schemas']['PublicWeddingWebsiteDto'];

/**
 * Request payload for creating a wedding website - Auto-generated from OpenAPI
 */
export type CreateWeddingWebsiteRequest = components['schemas']['CreateWeddingWebsiteRequestDto'];

/**
 * Request payload for updating a wedding website - Auto-generated from OpenAPI
 */
export type UpdateWeddingWebsiteRequest = components['schemas']['UpdateWeddingWebsiteRequestDto'];

/**
 * Media upload response - Auto-generated from OpenAPI
 */
export type MediaUploadResponseDto = components['schemas']['MediaUploadResponseDto'];

/**
 * Event data transfer object - Auto-generated from OpenAPI
 */
export type EventDto = components['schemas']['EventDto'];

// ============================================================================
// Content Types (not in OpenAPI spec - stored as JSON in backend)
// These define the structure of the website content
// ============================================================================

export interface HeroContent {
  coupleNames: string;
  date: string;
  tagline: string;
  backgroundImageId?: string;
  backgroundImageUrl?: string;
  displayStyle: 'centered' | 'left' | 'overlay';
}

export interface StoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  imageId?: string;
  imageUrl?: string;
}

export interface StoryContent {
  enabled: boolean;
  title: string;
  displayType: 'timeline' | 'narrative';
  items: StoryItem[];
}

export interface VenueDetails {
  enabled: boolean;
  title: string;
  venue: string;
  address: string;
  date: string;
  description: string;
  mapUrl: string;
}

export interface DetailsContent {
  enabled: boolean;
  title: string;
  ceremony: VenueDetails;
  reception: VenueDetails;
}

export interface EventsContent {
  enabled: boolean;
  title: string;
  showFromWeddingEvents: boolean;
}

export interface GalleryImage {
  id: string;
  mediaId?: string;
  url: string;
  caption?: string;
}

export interface GalleryContent {
  enabled: boolean;
  title: string;
  displayType: 'grid' | 'masonry' | 'carousel';
  images: GalleryImage[];
}

export interface RsvpContent {
  enabled: boolean;
  title: string;
  description: string;
  deadline: string;
}

export interface FooterContent {
  enabled: boolean;
  contactEmail: string;
  customMessage: string;
}

export interface WebsiteContent {
  hero: HeroContent;
  story: StoryContent;
  details: DetailsContent;
  events: EventsContent;
  gallery: GalleryContent;
  rsvp: RsvpContent;
  footer: FooterContent;
}

export interface TemplateSettings {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  [key: string]: string;
}

export interface WebsiteSettings {
  templateSettings: TemplateSettings;
}

// ============================================================================
// Extended types with typed content/settings (for frontend use)
// ============================================================================

/**
 * Extended Wedding Website DTO with typed content and settings
 * Use this when you need to work with the actual content structure
 */
export interface WeddingWebsite extends Omit<WeddingWebsiteDto, 'content' | 'settings'> {
  content: WebsiteContent;
  settings: WebsiteSettings;
}

/**
 * Extended Public Wedding Website DTO with typed content and settings
 */
export interface PublicWeddingWebsite extends Omit<PublicWeddingWebsiteDto, 'content' | 'settings'> {
  content: WebsiteContent;
  settings: WebsiteSettings;
}

/**
 * Media upload response type alias for backwards compatibility
 */
export type MediaUploadResponse = MediaUploadResponseDto;
