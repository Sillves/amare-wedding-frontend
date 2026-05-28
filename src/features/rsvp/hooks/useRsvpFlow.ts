import { useQuery, useMutation } from '@tanstack/react-query';
import { rsvpApi } from '../api/rsvpApi';
import type { RsvpFlowSubmitRequest } from '@/features/rsvp/types';

/**
 * Fetch the initial RSVP flow state for a wedding (open flow vs. passcode required).
 */
export function useRsvpFlowState(slugOrId: string) {
  return useQuery({
    queryKey: ['rsvp-flow-state', slugOrId],
    queryFn: () => rsvpApi.getFlowState(slugOrId),
    enabled: !!slugOrId,
    retry: false,
  });
}

export function useUnlockRsvpFlow(slugOrId: string) {
  return useMutation({
    mutationFn: (passcode: string) => rsvpApi.unlockFlow(slugOrId, passcode),
  });
}

export function useSubmitRsvpFlow(slugOrId: string) {
  return useMutation({
    mutationFn: (data: RsvpFlowSubmitRequest) => rsvpApi.submitFlow(slugOrId, data),
  });
}
