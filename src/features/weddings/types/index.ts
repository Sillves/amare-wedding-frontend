import type { components } from '@/types/api';

/**
 * Auto-generated types from OpenAPI spec
 */

/**
 * Wedding data transfer object - Auto-generated from OpenAPI
 */
export type WeddingDto = components['schemas']['WeddingDto'];

/**
 * Main Wedding type used throughout the application
 * Alias for WeddingDto with required fields enforced
 */
export interface Wedding {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  customDomain: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * Request payload for creating a wedding - Auto-generated from OpenAPI
 */
export type CreateWeddingRequest = components['schemas']['CreateWeddingRequestDto'];

/**
 * Request payload for updating a wedding
 * Note: This is not defined in the OpenAPI spec
 * All fields are optional for partial updates
 */
export interface UpdateWeddingRequest {
  title?: string;
  slug?: string;
  date?: string;
  location?: string;
}

/**
 * Guest data transfer object - Auto-generated from OpenAPI
 */
export type GuestDto = components['schemas']['GuestDto'];

/**
 * Request payload for creating a guest - Auto-generated from OpenAPI
 */
export type CreateGuestRequest = components['schemas']['CreateGuestRequestDto'];

/**
 * Request payload for updating a guest - Auto-generated from OpenAPI
 */
export type UpdateGuestRequest = components['schemas']['UpdateGuestRequestDto'];

/**
 * RSVP Status enum - Auto-generated from OpenAPI
 */
export type RsvpStatus = components['schemas']['RsvpStatus'];

/**
 * Wedding User data transfer object - Auto-generated from OpenAPI
 */
export type WeddingUserDto = components['schemas']['WeddingUserDto'];

/**
 * Wedding User Role enum - Auto-generated from OpenAPI
 */
export type WeddingUserRole = components['schemas']['WeddingUserRole'];
