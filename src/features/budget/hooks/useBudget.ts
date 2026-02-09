import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetApi, type UpsertWeddingBudgetRequestDto } from '../api/budgetApi';

export function useBudget(weddingId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['budget', weddingId],
    queryFn: () => budgetApi.get(weddingId),
    enabled: options?.enabled !== undefined ? options.enabled : !!weddingId,
  });
}

export function useUpsertBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      weddingId,
      data,
    }: {
      weddingId: string;
      data: UpsertWeddingBudgetRequestDto;
    }) => budgetApi.upsert(weddingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budget', variables.weddingId] });
      queryClient.invalidateQueries({
        queryKey: ['expenses', 'summary', variables.weddingId],
      });
    },
  });
}
