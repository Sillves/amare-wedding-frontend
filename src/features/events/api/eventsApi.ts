import { apiClient } from '@/lib/axios';
import type {
  EventDto,
  CreateEventRequest,
  UpdateEventRequest,
  AddGuestsToEventRequest,
  EventGuestBatchChangeResult,
  RemoveGuestsFromEventRequest,
  EventGuestBatchRemoveResult
} from '@/features/weddings/types';

/**
 * API client for event management
 * Follows the OpenAPI specification endpoints
 */
export const eventsApi = {
  /**
   * Get all events for a specific wedding
   * @param weddingId - Wedding UUID
   * @returns Promise<EventDto[]>
   */
  getByWedding: async (weddingId: string): Promise<EventDto[]> => {
    const response = await apiClient.get<EventDto[]>(`/weddings/${weddingId}/events`);
    return response.data;
  },

  /**
   * Get all events (authenticated user's weddings)
   * @returns Promise<EventDto[]>
   */
  getAll: async (): Promise<EventDto[]> => {
    const response = await apiClient.get<EventDto[]>('/events');
    return response.data;
  },

  /**
   * Get a single event by ID
   * @param eventId - Event UUID
   * @returns Promise<EventDto>
   */
  getById: async (eventId: string): Promise<EventDto> => {
    const response = await apiClient.get<EventDto>(`/events/${eventId}`);
    return response.data;
  },

  /**
   * Create a new event for a wedding
   * @param weddingId - Wedding UUID
   * @param data - Event creation payload
   * @returns Promise<EventDto>
   */
  create: async (weddingId: string, data: CreateEventRequest): Promise<EventDto> => {
    const response = await apiClient.post<EventDto>(`/weddings/${weddingId}/events`, data);
    return response.data;
  },

  /**
   * Update an existing event
   * @param eventId - Event UUID
   * @param data - Event update payload
   * @returns Promise<EventDto>
   */
  update: async (eventId: string, data: UpdateEventRequest): Promise<EventDto> => {
    const response = await apiClient.put<EventDto>(`/events/${eventId}`, data);
    return response.data;
  },

  /**
   * Delete an event
   * @param eventId - Event UUID
   * @returns Promise<void>
   */
  delete: async (eventId: string): Promise<void> => {
    await apiClient.delete(`/events/${eventId}`);
  },

  /**
   * Add a guest to an event
   * @param eventId - Event UUID
   * @param guestId - Guest UUID
   * @returns Promise<void>
   */
  addGuest: async (eventId: string, guestId: string): Promise<void> => {
    await apiClient.post(`/events/${eventId}/guests/${guestId}`);
  },

  /**
   * Add multiple guests to an event (bulk operation)
   * @param eventId - Event UUID
   * @param data - Request payload with guest IDs
   * @returns Promise<EventGuestBatchChangeResult>
   */
  addGuests: async (eventId: string, data: AddGuestsToEventRequest): Promise<EventGuestBatchChangeResult> => {
    const response = await apiClient.post<EventGuestBatchChangeResult>(`/events/${eventId}/guests`, data);
    return response.data;
  },

  /**
   * Remove a guest from an event
   * @param eventId - Event UUID
   * @param guestId - Guest UUID
   * @returns Promise<void>
   */
  removeGuest: async (eventId: string, guestId: string): Promise<void> => {
    await apiClient.delete(`/events/${eventId}/guests/${guestId}`);
  },

  /**
   * Remove multiple guests from an event (bulk operation)
   * @param eventId - Event UUID
   * @param data - Request payload with guest IDs
   * @returns Promise<EventGuestBatchRemoveResult>
   */
  removeGuests: async (eventId: string, data: RemoveGuestsFromEventRequest): Promise<EventGuestBatchRemoveResult> => {
    const response = await apiClient.delete<EventGuestBatchRemoveResult>(`/events/${eventId}/guests`, { data });
    return response.data;
  },
};
