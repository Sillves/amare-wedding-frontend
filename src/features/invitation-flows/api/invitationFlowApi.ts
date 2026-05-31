import { apiClient } from '@/lib/axios';
import type {
  InvitationFlowDto,
  CreateInvitationFlowRequest,
  UpdateInvitationFlowRequest,
  RsvpResponseDto,
} from '@/features/rsvp/types';

/**
 * Authenticated API client for couple-facing invitation-flow management
 * and the RSVP responses dashboard.
 */
export const invitationFlowApi = {
  getByWedding: async (weddingId: string): Promise<InvitationFlowDto[]> => {
    const response = await apiClient.get<InvitationFlowDto[]>(`/weddings/${weddingId}/invitation-flows`);
    return response.data;
  },

  create: async (weddingId: string, data: CreateInvitationFlowRequest): Promise<InvitationFlowDto> => {
    const response = await apiClient.post<InvitationFlowDto>(`/weddings/${weddingId}/invitation-flows`, data);
    return response.data;
  },

  update: async (
    weddingId: string,
    flowId: string,
    data: UpdateInvitationFlowRequest
  ): Promise<InvitationFlowDto> => {
    const response = await apiClient.put<InvitationFlowDto>(
      `/weddings/${weddingId}/invitation-flows/${flowId}`,
      data
    );
    return response.data;
  },

  remove: async (weddingId: string, flowId: string, force = false): Promise<void> => {
    await apiClient.delete(`/weddings/${weddingId}/invitation-flows/${flowId}`, {
      params: force ? { force: true } : undefined,
    });
  },

  getResponses: async (weddingId: string, flowId?: string): Promise<RsvpResponseDto[]> => {
    const response = await apiClient.get<RsvpResponseDto[]>(`/weddings/${weddingId}/rsvp-responses`, {
      params: flowId ? { flowId } : undefined,
    });
    return response.data;
  },
};
