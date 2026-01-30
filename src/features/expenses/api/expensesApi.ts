import { apiClient } from '@/lib/axios';
import type { components } from '@/types/api';

export type WeddingExpenseDto = components['schemas']['WeddingExpenseDto'];
export type CreateWeddingExpenseRequestDto = components['schemas']['CreateWeddingExpenseRequestDto'];
export type UpdateWeddingExpenseRequestDto = components['schemas']['UpdateWeddingExpenseRequestDto'];
export type WeddingExpenseSummaryDto = components['schemas']['WeddingExpenseSummaryDto'];
export type ExpenseCategory = components['schemas']['ExpenseCategory'];

export const expensesApi = {
  /**
   * Get all expenses for a specific wedding
   */
  getByWedding: async (weddingId: string): Promise<WeddingExpenseDto[]> => {
    const response = await apiClient.get<WeddingExpenseDto[]>(
      `/api/weddings/${weddingId}/expenses`
    );
    return response.data;
  },

  /**
   * Get expense summary with totals per category
   */
  getSummary: async (weddingId: string): Promise<WeddingExpenseSummaryDto> => {
    const response = await apiClient.get<WeddingExpenseSummaryDto>(
      `/api/weddings/${weddingId}/expenses/summary`
    );
    return response.data;
  },

  /**
   * Get a single expense by ID
   */
  getById: async (expenseId: string): Promise<WeddingExpenseDto> => {
    const response = await apiClient.get<WeddingExpenseDto>(
      `/api/expenses/${expenseId}`
    );
    return response.data;
  },

  /**
   * Create a new expense
   */
  create: async (
    weddingId: string,
    data: CreateWeddingExpenseRequestDto
  ): Promise<WeddingExpenseDto> => {
    const response = await apiClient.post<WeddingExpenseDto>(
      `/api/weddings/${weddingId}/expenses`,
      data
    );
    return response.data;
  },

  /**
   * Update an existing expense
   */
  update: async (
    expenseId: string,
    data: UpdateWeddingExpenseRequestDto
  ): Promise<WeddingExpenseDto> => {
    const response = await apiClient.put<WeddingExpenseDto>(
      `/api/expenses/${expenseId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete an expense
   */
  delete: async (expenseId: string): Promise<void> => {
    await apiClient.delete(`/api/expenses/${expenseId}`);
  },
};
