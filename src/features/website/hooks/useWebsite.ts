import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { websiteApi } from '../api/websiteApi';
import type {
  UpdateWeddingWebsiteRequest,
  WebsiteTemplate,
} from '../types';

export function useWebsite(weddingId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['website', weddingId],
    queryFn: () => websiteApi.getByWeddingId(weddingId),
    enabled: options?.enabled !== undefined ? options.enabled : !!weddingId,
    retry: false,
  });
}

export function useCreateWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      weddingId,
      data,
    }: {
      weddingId: string;
      data: { template?: WebsiteTemplate };
    }) => websiteApi.create(weddingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.weddingId] });
    },
  });
}

export function useUpdateWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      weddingId,
      data,
    }: {
      weddingId: string;
      data: UpdateWeddingWebsiteRequest;
    }) => websiteApi.update(weddingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.weddingId] });
    },
  });
}

export function usePublishWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weddingId: string) => websiteApi.publish(weddingId),
    onSuccess: (_, weddingId) => {
      queryClient.invalidateQueries({ queryKey: ['website', weddingId] });
    },
  });
}

export function useUnpublishWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weddingId: string) => websiteApi.unpublish(weddingId),
    onSuccess: (_, weddingId) => {
      queryClient.invalidateQueries({ queryKey: ['website', weddingId] });
    },
  });
}

export function useDeleteWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weddingId: string) => websiteApi.delete(weddingId),
    onSuccess: (_, weddingId) => {
      queryClient.invalidateQueries({ queryKey: ['website', weddingId] });
    },
  });
}

export function usePublicWebsite(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['public-website', slug],
    queryFn: () => websiteApi.getPublicBySlug(slug),
    enabled: options?.enabled !== undefined ? options.enabled : !!slug,
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ weddingId, file }: { weddingId: string; file: File }) =>
      websiteApi.uploadMedia(weddingId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['media', variables.weddingId] });
    },
  });
}

export function useWeddingMedia(weddingId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['media', weddingId],
    queryFn: () => websiteApi.getMedia(weddingId),
    enabled: options?.enabled !== undefined ? options.enabled : !!weddingId,
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      weddingId,
      mediaId,
    }: {
      weddingId: string;
      mediaId: string;
    }) => websiteApi.deleteMedia(weddingId, mediaId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['media', variables.weddingId] });
    },
  });
}
