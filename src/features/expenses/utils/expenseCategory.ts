import type { ExpenseCategory } from '../api/expensesApi';

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; labelKey: string }[] = [
  { value: 0, labelKey: 'expenses:categories.venue' },
  { value: 1, labelKey: 'expenses:categories.catering' },
  { value: 2, labelKey: 'expenses:categories.photography' },
  { value: 3, labelKey: 'expenses:categories.decoration' },
  { value: 4, labelKey: 'expenses:categories.attire' },
  { value: 5, labelKey: 'expenses:categories.transport' },
  { value: 6, labelKey: 'expenses:categories.other' },
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  0: '#3b82f6', // Venue - blue
  1: '#f97316', // Catering - orange
  2: '#a855f7', // Photography - purple
  3: '#ec4899', // Decoration - pink
  4: '#6366f1', // Attire - indigo
  5: '#22c55e', // Transport - green
  6: '#6b7280', // Other - gray
};

export const CATEGORY_NAMES: Record<ExpenseCategory, string> = {
  0: 'Venue',
  1: 'Catering',
  2: 'Photography',
  3: 'Decoration',
  4: 'Attire',
  5: 'Transport',
  6: 'Other',
};

export function getCategoryLabel(category: ExpenseCategory): string {
  return EXPENSE_CATEGORIES.find((c) => c.value === category)?.labelKey ?? 'expenses:categories.other';
}

export function getCategoryColor(category: ExpenseCategory): string {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS[6];
}
