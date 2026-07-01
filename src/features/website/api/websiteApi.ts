import axios from 'axios';
import { apiClient } from '@/lib/axios';
import type {
  WeddingWebsiteDto,
  CreateWeddingWebsiteRequest,
  UpdateWeddingWebsiteRequest,
  PublicWebsiteState,
  MediaUploadResponse,
  WebsiteTemplate,
} from '../types';

/**
 * Separate client for the public website endpoint. withCredentials is enabled so the signed
 * rsvp_flow cookie (set when a guest unlocks) is sent, letting the server personalise/authorise
 * the response. It intentionally omits the auth interceptor + 401-logout of the main apiClient.
 */
const publicWebsiteClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://amare.wedding/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const websiteApi = {
  getByWeddingId: async (weddingId: string): Promise<WeddingWebsiteDto> => {
    const response = await apiClient.get<WeddingWebsiteDto>(`/weddings/${weddingId}/website`);
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
    const response = await apiClient.put<WeddingWebsiteDto>(`/weddings/${weddingId}/website`, data);
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

  getPublicBySlug: async (slug: string): Promise<PublicWebsiteState> => {
    const response = await publicWebsiteClient.get<PublicWebsiteState>(`/w/${slug}`);
    return response.data;
  },

  uploadMedia: async (weddingId: string, file: File): Promise<MediaUploadResponse> => {
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
    const response = await apiClient.get<MediaUploadResponse[]>(`/weddings/${weddingId}/media`);
    return response.data;
  },

  deleteMedia: async (weddingId: string, mediaId: string): Promise<void> => {
    await apiClient.delete(`/weddings/${weddingId}/media/${mediaId}`);
  },
};
