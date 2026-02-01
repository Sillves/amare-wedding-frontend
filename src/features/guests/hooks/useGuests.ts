import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guestsApi } from '../api/guestsApi';
import type { CreateGuestRequest, UpdateGuestRequest } from '@/features/weddings/types';

/**
 * Hook for fetching all guests for a specific wedding
 * @param weddingId - Wedding UUID
 * @param options - Optional query options (e.g., enabled)
 * @returns React Query query for fetching guests list
 */
export function useGuests(weddingId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['guests', weddingId],
    queryFn: () => guestsApi.getByWedding(weddingId),
    enabled: options?.enabled !== undefined ? options.enabled : !!weddingId,
  });
}

/**
 * Hook for fetching a single guest by ID
 * @param guestId - Guest UUID
 * @returns React Query query for fetching a specific guest
 */
export function useGuest(guestId: string) {
  return useQuery({
    queryKey: ['guests', 'detail', guestId],
    queryFn: () => guestsApi.getById(guestId),
    enabled: !!guestId,
  });
}

/**
 * Hook for creating a new guest
 * Automatically invalidates the guests query for the wedding on success
 * @returns React Query mutation for creating a guest
 */
export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ weddingId, data }: { weddingId: string; data: CreateGuestRequest }) =>
      guestsApi.create(weddingId, data),
    onSuccess: (_, variables) => {
      // Only invalidate the guests list for this specific wedding
      queryClient.invalidateQueries({ queryKey: ['guests', variables.weddingId] });
    },
  });
}

/**
 * Hook for updating an existing guest
 * Automatically invalidates relevant queries on success
 * @returns React Query mutation for updating a guest
 */
export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guestId, data }: { guestId: string; data: UpdateGuestRequest }) =>
      guestsApi.update(guestId, data),
    onSuccess: (data) => {
      // Only invalidate the guest list and specific guest detail
      queryClient.invalidateQueries({ queryKey: ['guests', data.weddingId] });
      queryClient.invalidateQueries({ queryKey: ['guests', 'detail', data.id] });
    },
  });
}

/**
 * Hook for deleting a guest
 * Automatically invalidates the guests query on success
 * @returns React Query mutation for deleting a guest
 */
export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guestId, weddingId }: { guestId: string; weddingId: string }) =>
      guestsApi.delete(guestId),
    onSuccess: (_, variables) => {
      // Only invalidate the guests list for this specific wedding
      queryClient.invalidateQueries({ queryKey: ['guests', variables.weddingId] });
    },
  });
}

/**
 * Hook for sending invitation email to a single guest
 * Automatically invalidates relevant queries on success to refresh invitation status
 * @returns React Query mutation for sending guest invitation
 */
export function useSendGuestInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ weddingId, guestId }: { weddingId: string; guestId: string }) =>
      guestsApi.sendInvitation(weddingId, guestId),
    onSuccess: (_, variables) => {
      // Invalidate guest list to update invitationSentAt in the table
      queryClient.invalidateQueries({ queryKey: ['guests', variables.weddingId] });
      queryClient.invalidateQueries({ queryKey: ['guests', 'detail', variables.guestId] });
    },
  });
}

/**
 * Hook for sending invitation emails to multiple guests (bulk operation)
 * Automatically invalidates relevant queries on success to refresh invitation status
 * @returns React Query mutation for sending multiple guest invitations
 */
export function useSendGuestInvitations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ weddingId, guestIds }: { weddingId: string; guestIds: string[] }) =>
      guestsApi.sendInvitations(weddingId, { guestIds }),
    onSuccess: (_, variables) => {
      // Invalidate guest list to update invitationSentAt in the table
      queryClient.invalidateQueries({ queryKey: ['guests', variables.weddingId] });
      // Also invalidate specific guest details
      variables.guestIds.forEach(guestId => {
        queryClient.invalidateQueries({ queryKey: ['guests', 'detail', guestId] });
      });
    },
  });
}
