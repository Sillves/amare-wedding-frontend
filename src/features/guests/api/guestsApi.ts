import { apiClient } from '@/lib/axios';
import type {
  GuestDto,
  CreateGuestRequest,
  UpdateGuestRequest,
  SendInvitationsRequest,
  InvitationSendResult
} from '@/features/weddings/types';
import { normalizeRsvpStatus } from '../utils/rsvpStatusMapper';

/**
 * API client for guest management
 * Follows the OpenAPI specification endpoints
 */
export const guestsApi = {
  /**
   * Get all guests for a specific wedding
   * @param weddingId - Wedding UUID
   * @returns Promise<GuestDto[]>
   */
  getByWedding: async (weddingId: string): Promise<GuestDto[]> => {
    const response = await apiClient.get<GuestDto[]>(`/weddings/${weddingId}/guests`);
    // Normalize RSVP status (backend may send strings instead of integers)
    return response.data.map(guest => ({
      ...guest,
      rsvpStatus: normalizeRsvpStatus(guest.rsvpStatus),
    }));
  },

  /**
   * Get a single guest by ID
   * @param guestId - Guest UUID
   * @returns Promise<GuestDto>
   */
  getById: async (guestId: string): Promise<GuestDto> => {
    const response = await apiClient.get<GuestDto>(`/guests/${guestId}`);
    return {
      ...response.data,
      rsvpStatus: normalizeRsvpStatus(response.data.rsvpStatus),
    };
  },

  /**
   * Create a new guest for a wedding
   * @param weddingId - Wedding UUID
   * @param data - Guest creation payload
   * @returns Promise<GuestDto>
   */
  create: async (weddingId: string, data: CreateGuestRequest): Promise<GuestDto> => {
    const response = await apiClient.post<GuestDto>(`/weddings/${weddingId}/guests`, data);
    return {
      ...response.data,
      rsvpStatus: normalizeRsvpStatus(response.data.rsvpStatus),
    };
  },

  /**
   * Update an existing guest
   * @param guestId - Guest UUID
   * @param data - Guest update payload
   * @returns Promise<GuestDto>
   */
  update: async (guestId: string, data: UpdateGuestRequest): Promise<GuestDto> => {
    const response = await apiClient.put<GuestDto>(`/guests/${guestId}`, data);
    return {
      ...response.data,
      rsvpStatus: normalizeRsvpStatus(response.data.rsvpStatus),
    };
  },

  /**
   * Delete a guest
   * @param guestId - Guest UUID
   * @returns Promise<void>
   */
  delete: async (guestId: string): Promise<void> => {
    await apiClient.delete(`/guests/${guestId}`);
  },

  /**
   * Send invitation email to a single guest
   * @param weddingId - Wedding UUID
   * @param guestId - Guest UUID
   * @returns Promise<void>
   */
  sendInvitation: async (weddingId: string, guestId: string): Promise<void> => {
    await apiClient.post(`/weddings/${weddingId}/guests/${guestId}/send-invitation`);
  },

  /**
   * Send invitation emails to multiple guests (bulk operation)
   * @param weddingId - Wedding UUID
   * @param data - Request payload with guest IDs
   * @returns Promise<InvitationSendResult>
   */
  sendInvitations: async (weddingId: string, data: SendInvitationsRequest): Promise<InvitationSendResult> => {
    const response = await apiClient.post<InvitationSendResult>(`/weddings/${weddingId}/guests/send-invitations`, data);
    return response.data;
  },
};
