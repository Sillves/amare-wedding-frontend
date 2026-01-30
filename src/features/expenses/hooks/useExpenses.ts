import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  expensesApi,
  type CreateWeddingExpenseRequestDto,
  type UpdateWeddingExpenseRequestDto,
} from '../api/expensesApi';

/**
 * Hook for fetching all expenses for a specific wedding
 */
export function useExpenses(weddingId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['expenses', weddingId],
    queryFn: () => expensesApi.getByWedding(weddingId),
    enabled: options?.enabled !== undefined ? options.enabled : !!weddingId,
  });
}

/**
 * Hook for fetching expense summary with category totals
 */
export function useExpenseSummary(weddingId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['expenses', 'summary', weddingId],
    queryFn: () => expensesApi.getSummary(weddingId),
    enabled: options?.enabled !== undefined ? options.enabled : !!weddingId,
  });
}

/**
 * Hook for fetching a single expense by ID
 */
export function useExpense(expenseId: string) {
  return useQuery({
    queryKey: ['expenses', 'detail', expenseId],
    queryFn: () => expensesApi.getById(expenseId),
    enabled: !!expenseId,
  });
}

/**
 * Hook for creating a new expense
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      weddingId,
      data,
    }: {
      weddingId: string;
      data: CreateWeddingExpenseRequestDto;
    }) => expensesApi.create(weddingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.weddingId] });
      queryClient.invalidateQueries({
        queryKey: ['expenses', 'summary', variables.weddingId],
      });
    },
  });
}

/**
 * Hook for updating an existing expense
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expenseId,
      weddingId,
      data,
    }: {
      expenseId: string;
      weddingId: string;
      data: UpdateWeddingExpenseRequestDto;
    }) => expensesApi.update(expenseId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.weddingId] });
      queryClient.invalidateQueries({
        queryKey: ['expenses', 'summary', variables.weddingId],
      });
      queryClient.invalidateQueries({
        queryKey: ['expenses', 'detail', variables.expenseId],
      });
    },
  });
}

/**
 * Hook for deleting an expense
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId, weddingId }: { expenseId: string; weddingId: string }) =>
      expensesApi.delete(expenseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.weddingId] });
      queryClient.invalidateQueries({
        queryKey: ['expenses', 'summary', variables.weddingId],
      });
    },
  });
}
