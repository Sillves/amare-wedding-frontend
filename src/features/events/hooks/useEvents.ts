import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../api/eventsApi';
import type { CreateEventRequest, UpdateEventRequest } from '@/features/weddings/types';

/**
 * Hook for fetching all events for a specific wedding
 * @param weddingId - Wedding UUID
 * @returns React Query query for fetching events list
 */
export function useEvents(weddingId: string) {
  return useQuery({
    queryKey: ['events', weddingId],
    queryFn: () => eventsApi.getByWedding(weddingId),
    enabled: !!weddingId,
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
      queryClient.invalidateQueries({ queryKey: ['events', variables.weddingId] });
      queryClient.invalidateQueries({ queryKey: ['events', 'all'] });
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
      queryClient.invalidateQueries({ queryKey: ['events', data.weddingId] });
      queryClient.invalidateQueries({ queryKey: ['events', 'detail', data.id] });
      queryClient.invalidateQueries({ queryKey: ['events', 'all'] });
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
      queryClient.invalidateQueries({ queryKey: ['events', variables.weddingId] });
      queryClient.invalidateQueries({ queryKey: ['events', 'all'] });
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
      queryClient.invalidateQueries({ queryKey: ['events', 'detail', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
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
      queryClient.invalidateQueries({ queryKey: ['events', 'detail', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });
}
