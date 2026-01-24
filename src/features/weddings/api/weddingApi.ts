import { apiClient } from '@/lib/axios';
import type { Wedding, CreateWeddingRequest, UpdateWeddingRequest } from '../types';

export const weddingApi = {
  getAll: async (): Promise<Wedding[]> => {
    const response = await apiClient.get<Wedding[]>('/weddings');
    return response.data;
  },

  getById: async (id: string): Promise<Wedding> => {
    const response = await apiClient.get<Wedding>(`/weddings/${id}`);
    return response.data;
  },

  create: async (data: CreateWeddingRequest): Promise<Wedding> => {
    const response = await apiClient.post<Wedding>('/weddings', data);
    return response.data;
  },

  update: async (id: string, data: UpdateWeddingRequest): Promise<Wedding> => {
    const response = await apiClient.put<Wedding>(`/weddings/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/weddings/${id}`);
  },
};
