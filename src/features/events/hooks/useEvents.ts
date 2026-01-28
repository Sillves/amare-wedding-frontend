import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../api/eventsApi';
import type { CreateEventRequest, UpdateEventRequest } from '@/features/weddings/types';

/**
 * Hook for fetching all events for a specific wedding
 * @param weddingId - Wedding UUID
 * @param options - Optional query options (e.g., enabled)
 * @returns React Query query for fetching events list
 */
export function useEvents(weddingId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['events', weddingId],
    queryFn: () => eventsApi.getByWedding(weddingId),
    enabled: options?.enabled !== undefined ? options.enabled : !!weddingId,
  });
}

/**
 * Hook for fetching all events across all user's weddings
 * @returns React Query query for fetching all events
 */
export function useAllEvents() {
  return useQuery({
    queryKey: ['events', 'all'],
    queryFn: () => eventsApi.getAll(),
  });
}

/**
 * Hook for fetching a single event by ID
 * @param eventId - Event UUID
 * @returns React Query query for fetching a specific event
 */
export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ['events', 'detail', eventId],
    queryFn: () => eventsApi.getById(eventId),
    enabled: !!eventId,
  });
}

/**
 * Hook for creating a new event
 * Automatically invalidates the events query for the wedding on success
 * @returns React Query mutation for creating an event
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ weddingId, data }: { weddingId: string; data: CreateEventRequest }) =>
      eventsApi.create(weddingId, data),
    onSuccess: (_, variables) => {
      // Only invalidate events for the specific wedding
      queryClient.invalidateQueries({ queryKey: ['events', variables.weddingId] });
    },
  });
}

/**
 * Hook for updating an existing event
 * Automatically invalidates relevant queries on success
 * @returns React Query mutation for updating an event
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: UpdateEventRequest }) =>
      eventsApi.update(eventId, data),
    onSuccess: (data) => {
      // Only invalidate events for the specific wedding and event detail
      queryClient.invalidateQueries({ queryKey: ['events', data.weddingId] });
      queryClient.invalidateQueries({ queryKey: ['events', 'detail', data.id] });
    },
  });
}

/**
 * Hook for deleting an event
 * Automatically invalidates the events query on success
 * @returns React Query mutation for deleting an event
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, weddingId }: { eventId: string; weddingId: string }) =>
      eventsApi.delete(eventId),
    onSuccess: (_, variables) => {
      // Only invalidate events for the specific wedding
      queryClient.invalidateQueries({ queryKey: ['events', variables.weddingId] });
    },
  });
}

/**
 * Hook for adding a guest to an event
 * Automatically invalidates relevant queries on success
 * @returns React Query mutation for adding guest to event
 */
export function useAddGuestToEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, guestId }: { eventId: string; guestId: string }) =>
      eventsApi.addGuest(eventId, guestId),
    onSuccess: (_, variables) => {
      // Only invalidate the specific event that was modified
      queryClient.invalidateQueries({ queryKey: ['events', 'detail', variables.eventId] });
    },
  });
}

/**
 * Hook for adding multiple guests to an event (bulk operation)
 * Automatically invalidates relevant queries on success
 * @returns React Query mutation for adding multiple guests to event
 */
export function useAddGuestsToEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, guestIds, weddingId }: { eventId: string; guestIds: string[]; weddingId?: string }) =>
      eventsApi.addGuests(eventId, { guestIds }),
    onSuccess: (_, variables) => {
      // Invalidate the specific event detail
      queryClient.invalidateQueries({ queryKey: ['events', 'detail', variables.eventId] });
      // Invalidate the events list for the wedding to update guest counts
      if (variables.weddingId) {
        queryClient.invalidateQueries({ queryKey: ['events', variables.weddingId] });
      }
    },
  });
}

/**
 * Hook for removing a guest from an event
 * Automatically invalidates relevant queries on success
 * @returns React Query mutation for removing guest from event
 */
export function useRemoveGuestFromEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, guestId }: { eventId: string; guestId: string }) =>
      eventsApi.removeGuest(eventId, guestId),
    onSuccess: (_, variables) => {
      // Only invalidate the specific event that was modified
      queryClient.invalidateQueries({ queryKey: ['events', 'detail', variables.eventId] });
    },
  });
}

/**
 * Hook for removing multiple guests from an event (bulk operation)
 * Automatically invalidates relevant queries on success
 * @returns React Query mutation for removing multiple guests from event
 */
export function useRemoveGuestsFromEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, guestIds, weddingId }: { eventId: string; guestIds: string[]; weddingId?: string }) =>
      eventsApi.removeGuests(eventId, { guestIds }),
    onSuccess: (_, variables) => {
      // Invalidate the specific event detail
      queryClient.invalidateQueries({ queryKey: ['events', 'detail', variables.eventId] });
      // Invalidate the events list for the wedding to update guest counts
      if (variables.weddingId) {
        queryClient.invalidateQueries({ queryKey: ['events', variables.weddingId] });
      }
    },
  });
}
