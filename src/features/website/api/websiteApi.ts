import { apiClient } from '@/lib/axios';
import type {
  WeddingWebsiteDto,
  CreateWeddingWebsiteRequest,
  UpdateWeddingWebsiteRequest,
  PublicWeddingWebsiteDto,
  MediaUploadResponse,
  WebsiteTemplate,
} from '../types';

export const websiteApi = {
  getByWeddingId: async (weddingId: string): Promise<WeddingWebsiteDto> => {
    const response = await apiClient.get<WeddingWebsiteDto>(
      `/weddings/${weddingId}/website`
    );
    return response.data;
  },

  create: async (
    weddingId: string,
    data: { template?: WebsiteTemplate }
  ): Promise<WeddingWebsiteDto> => {
    const response = await apiClient.post<WeddingWebsiteDto>(
      `/weddings/${weddingId}/website`,
      data
    );
    return response.data;
  },

  update: async (
    weddingId: string,
    data: UpdateWeddingWebsiteRequest
  ): Promise<WeddingWebsiteDto> => {
    const response = await apiClient.put<WeddingWebsiteDto>(
      `/weddings/${weddingId}/website`,
      data
    );
    return response.data;
  },

  publish: async (weddingId: string): Promise<WeddingWebsiteDto> => {
    const response = await apiClient.post<WeddingWebsiteDto>(
      `/weddings/${weddingId}/website/publish`
    );
    return response.data;
  },

  unpublish: async (weddingId: string): Promise<WeddingWebsiteDto> => {
    const response = await apiClient.post<WeddingWebsiteDto>(
      `/weddings/${weddingId}/website/unpublish`
    );
    return response.data;
  },

  delete: async (weddingId: string): Promise<void> => {
    await apiClient.delete(`/weddings/${weddingId}/website`);
  },

  getPublicBySlug: async (slug: string): Promise<PublicWeddingWebsiteDto> => {
    const response = await apiClient.get<PublicWeddingWebsiteDto>(`/w/${slug}`);
    return response.data;
  },

  uploadMedia: async (
    weddingId: string,
    file: File
  ): Promise<MediaUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    // Don't set Content-Type header - browser will set it automatically with boundary
    const response = await apiClient.post<MediaUploadResponse>(
      `/weddings/${weddingId}/media`,
      formData
    );
    return response.data;
  },

  getMedia: async (weddingId: string): Promise<MediaUploadResponse[]> => {
    const response = await apiClient.get<MediaUploadResponse[]>(
      `/weddings/${weddingId}/media`
    );
    return response.data;
  },

  deleteMedia: async (weddingId: string, mediaId: string): Promise<void> => {
    await apiClient.delete(`/weddings/${weddingId}/media/${mediaId}`);
  },
};
