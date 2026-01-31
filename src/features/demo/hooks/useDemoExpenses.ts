import { useMemo } from 'react';
import { DEMO_EXPENSE_SUMMARY, DEMO_EXPENSES } from '../data/mockExpenses';
import type { WeddingExpenseSummaryDto, WeddingExpenseDto } from '@/features/expenses/api/expensesApi';

interface UseDemoExpenseSummaryReturn {
  data: WeddingExpenseSummaryDto;
  isLoading: false;
  error: null;
}

/**
 * Demo version of useExpenseSummary hook
 * Returns pre-calculated expense summary for the demo wedding
 */
export function useDemoExpenseSummary(): UseDemoExpenseSummaryReturn {
  const data = useMemo(() => DEMO_EXPENSE_SUMMARY, []);

  return {
    data,
    isLoading: false,
    error: null,
  };
}

interface UseDemoExpensesReturn {
  data: WeddingExpenseDto[];
  isLoading: false;
  error: null;
}

/**
 * Demo version of useExpenses hook
 * Returns mock expenses for the demo wedding
 */
export function useDemoExpenses(): UseDemoExpensesReturn {
  const data = useMemo(() => DEMO_EXPENSES, []);

  return {
    data,
    isLoading: false,
    error: null,
  };
}
