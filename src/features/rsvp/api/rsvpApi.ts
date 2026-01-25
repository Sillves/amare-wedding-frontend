import axios from 'axios';
import type { GuestDto, WeddingPublicDto } from '@/features/weddings/types';
import type { components } from '@/types/api';
import { normalizeRsvpStatus } from '@/features/guests/utils/rsvpStatusMapper';

type RsvpSubmitRequest = components['schemas']['RsvpSubmitRequestDto'];

/**
 * Public RSVP API client
 * Does not use authentication - this is a public endpoint
 */

// Create a separate axios instance for public endpoints (no auth headers)
const publicApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const rsvpApi = {
  /**
   * Get public wedding information (public endpoint)
   * @param idOrSlug - Wedding UUID or slug
   * @returns Promise<WeddingPublicDto>
   */
  getPublicInfo: async (idOrSlug: string): Promise<WeddingPublicDto> => {
    const response = await publicApiClient.get<WeddingPublicDto>(`/weddings/${idOrSlug}/public`);
    return response.data;
  },

  /**
   * Submit RSVP for a wedding (public endpoint)
   * @param weddingId - Wedding UUID or slug
   * @param data - RSVP submission data
   * @returns Promise<GuestDto>
   */
  submit: async (weddingId: string, data: RsvpSubmitRequest): Promise<GuestDto> => {
    const response = await publicApiClient.post<GuestDto>(`/weddings/${weddingId}/rsvp`, data);
    return {
      ...response.data,
      rsvpStatus: normalizeRsvpStatus(response.data.rsvpStatus),
    };
  },
};
