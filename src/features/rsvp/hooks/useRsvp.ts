import { useQuery, useMutation } from '@tanstack/react-query';
import { rsvpApi } from '../api/rsvpApi';
import type { components } from '@/types/api';

type RsvpSubmitRequest = components['schemas']['RsvpSubmitRequestDto'];

/**
 * Hook for fetching public wedding information (public - no authentication required)
 * @param idOrSlug - Wedding UUID or slug
 * @returns React Query query for fetching public wedding info
 */
export function useWeddingPublicInfo(idOrSlug: string) {
  return useQuery({
    queryKey: ['wedding-public', idOrSlug],
    queryFn: () => rsvpApi.getPublicInfo(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 60000, // Cache for 1 minute (backend has 30-120s cache)
    retry: 2,
  });
}

/**
 * Hook for submitting RSVP (public - no authentication required)
 * @returns React Query mutation for submitting RSVP
 */
export function useSubmitRsvp() {
  return useMutation({
    mutationFn: ({ weddingId, data }: { weddingId: string; data: RsvpSubmitRequest }) =>
      rsvpApi.submit(weddingId, data),
  });
}
