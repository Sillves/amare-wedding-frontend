import { apiClient } from '@/lib/axios';
import type { ExpenseCategory } from '@/features/expenses/api/expensesApi';

export interface BudgetAllocationDto {
  category?: ExpenseCategory;
  amount?: number;
}

export interface WeddingBudgetDto {
  id?: string;
  weddingId?: string;
  totalBudget?: number;
  allocations?: BudgetAllocationDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetAllocationRequestDto {
  category?: ExpenseCategory;
  amount?: number;
}

export interface UpsertWeddingBudgetRequestDto {
  totalBudget?: number;
  allocations?: BudgetAllocationRequestDto[];
}

export const budgetApi = {
  get: async (weddingId: string): Promise<WeddingBudgetDto | null> => {
    const response = await apiClient.get<WeddingBudgetDto | null>(
      `/api/weddings/${weddingId}/budget`
    );
    return response.data;
  },

  upsert: async (
    weddingId: string,
    data: UpsertWeddingBudgetRequestDto
  ): Promise<WeddingBudgetDto> => {
    const response = await apiClient.put<WeddingBudgetDto>(
      `/api/weddings/${weddingId}/budget`,
      data
    );
    return response.data;
  },
};
