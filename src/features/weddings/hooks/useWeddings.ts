import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weddingApi } from '../api/weddingApi';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { CreateWeddingRequest, UpdateWeddingRequest } from '../types';

/**
 * Hook for fetching all weddings
 * Only executes when a valid token exists
 * @param options - Optional query options
 * @returns React Query query for fetching weddings list
 */
export function useWeddings(options?: { enabled?: boolean }) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['weddings'],
    queryFn: weddingApi.getAll,
    enabled: options?.enabled !== undefined ? (options.enabled && !!token) : !!token,
  });
}

/**
 * Hook for fetching a single wedding by ID
 * @param id - Wedding UUID
 * @returns React Query query for fetching a specific wedding
 */
export function useWedding(id: string) {
  return useQuery({
    queryKey: ['weddings', id],
    queryFn: () => weddingApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook for creating a new wedding
 * Automatically invalidates the weddings query on success
 * @returns React Query mutation for creating a wedding
 */
export function useCreateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWeddingRequest) => weddingApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
    },
  });
}

/**
 * Hook for updating an existing wedding
 * Automatically invalidates relevant queries on success
 * @returns React Query mutation for updating a wedding
 */
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

/**
 * Hook for deleting a wedding
 * Automatically invalidates the weddings query on success
 * @returns React Query mutation for deleting a wedding
 */
export function useDeleteWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => weddingApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
    },
  });
}
