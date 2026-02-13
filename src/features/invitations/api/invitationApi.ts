import { apiClient } from '@/lib/axios';
import type {
  WeddingInvitationDto,
  CreateWeddingInvitationRequest,
  UpdateWeddingUserRequest,
} from '../types';
import type { WeddingUserDto } from '@/features/weddings/types';

export const invitationApi = {
  create: async (weddingId: string, data: CreateWeddingInvitationRequest): Promise<WeddingInvitationDto> => {
    const response = await apiClient.post<WeddingInvitationDto>(
      `/weddings/${weddingId}/invitations`, data);
    return response.data;
  },

  getAll: async (weddingId: string): Promise<WeddingInvitationDto[]> => {
    const response = await apiClient.get<WeddingInvitationDto[]>(
      `/weddings/${weddingId}/invitations`);
    return response.data;
  },

  cancel: async (weddingId: string, invitationId: string): Promise<void> => {
    await apiClient.delete(`/weddings/${weddingId}/invitations/${invitationId}`);
  },

  getByToken: async (token: string): Promise<WeddingInvitationDto> => {
    const response = await apiClient.get<WeddingInvitationDto>(`/invitations/${token}`);
    return response.data;
  },

  accept: async (token: string): Promise<void> => {
    await apiClient.post(`/invitations/${token}/accept`);
  },

  updateUserPermissions: async (
    weddingId: string, userId: string, data: UpdateWeddingUserRequest
  ): Promise<WeddingUserDto> => {
    const response = await apiClient.put<WeddingUserDto>(
      `/weddings/${weddingId}/users/${userId}`, data);
    return response.data;
  },
};
