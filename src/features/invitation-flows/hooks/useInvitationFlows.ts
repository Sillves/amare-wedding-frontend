import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationFlowApi } from '../api/invitationFlowApi';
import type { CreateInvitationFlowRequest, UpdateInvitationFlowRequest } from '@/features/rsvp/types';

const flowKey = (weddingId: string) => ['invitation-flows', weddingId];
const responsesKey = (weddingId: string, flowId?: string) => ['rsvp-responses', weddingId, flowId ?? 'all'];

export function useInvitationFlows(weddingId: string) {
  return useQuery({
    queryKey: flowKey(weddingId),
    queryFn: () => invitationFlowApi.getByWedding(weddingId),
    enabled: !!weddingId,
  });
}

export function useCreateInvitationFlow(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvitationFlowRequest) => invitationFlowApi.create(weddingId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: flowKey(weddingId) }),
  });
}

export function useUpdateInvitationFlow(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ flowId, data }: { flowId: string; data: UpdateInvitationFlowRequest }) =>
      invitationFlowApi.update(weddingId, flowId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: flowKey(weddingId) }),
  });
}

export function useDeleteInvitationFlow(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ flowId, force }: { flowId: string; force?: boolean }) =>
      invitationFlowApi.remove(weddingId, flowId, force),
    onSuccess: () => qc.invalidateQueries({ queryKey: flowKey(weddingId) }),
  });
}

export function useRsvpResponses(weddingId: string, flowId?: string) {
  return useQuery({
    queryKey: responsesKey(weddingId, flowId),
    queryFn: () => invitationFlowApi.getResponses(weddingId, flowId),
    enabled: !!weddingId,
  });
}
