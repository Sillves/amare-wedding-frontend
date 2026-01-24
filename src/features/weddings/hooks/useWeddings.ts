import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weddingApi } from '../api/weddingApi';
import type { CreateWeddingRequest, UpdateWeddingRequest } from '../types';

export function useWeddings() {
  return useQuery({
    queryKey: ['weddings'],
    queryFn: weddingApi.getAll,
  });
}

export function useWedding(id: string) {
  return useQuery({
    queryKey: ['weddings', id],
    queryFn: () => weddingApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWeddingRequest) => weddingApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
    },
  });
}

export function useUpdateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWeddingRequest }) =>
      weddingApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
      queryClient.invalidateQueries({ queryKey: ['weddings', variables.id] });
    },
  });
}

export function useDeleteWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => weddingApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
    },
  });
}
