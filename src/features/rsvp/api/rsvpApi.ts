import axios from 'axios';
import type { GuestDto, WeddingPublicDto } from '@/features/weddings/types';
import type { components } from '@/types/api';
import type {
  RsvpFlowState,
  RsvpFlowPublic,
  RsvpFlowSubmitRequest,
  RsvpSubmitResult,
} from '@/features/rsvp/types';
import { normalizeRsvpStatus } from '@/features/guests/utils/rsvpStatusMapper';

type RsvpSubmitRequest = components['schemas']['RsvpSubmitRequestDto'];

/**
 * Public RSVP API client
 * Does not use authentication - this is a public endpoint.
 * withCredentials is enabled so the signed rsvp_flow cookie (set on unlock) is sent on submit.
 */

// Create a separate axios instance for public endpoints (no auth headers)
const publicApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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

  /**
   * Flow-based RSVP (new): get the initial state for a wedding's RSVP.
   * Returns whether flows exist, whether a passcode is required, and the open flow if applicable.
   */
  getFlowState: async (slugOrId: string): Promise<RsvpFlowState> => {
    const response = await publicApiClient.get<RsvpFlowState>(`/public/weddings/${slugOrId}/rsvp`);
    return response.data;
  },

  /**
   * Unlock a passcode-protected flow. Sets the signed rsvp_flow cookie on success.
   */
  unlockFlow: async (slugOrId: string, passcode: string): Promise<RsvpFlowPublic> => {
    const response = await publicApiClient.post<RsvpFlowPublic>(
      `/public/weddings/${slugOrId}/rsvp/unlock`,
      { passcode }
    );
    return response.data;
  },

  /**
   * Submit an RSVP for the unlocked flow (cookie carries the flow id).
   */
  submitFlow: async (slugOrId: string, data: RsvpFlowSubmitRequest): Promise<RsvpSubmitResult> => {
    const response = await publicApiClient.post<RsvpSubmitResult>(
      `/public/weddings/${slugOrId}/rsvp/submit`,
      data
    );
    return response.data;
  },
};
