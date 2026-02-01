import type { WeddingExpenseDto, WeddingExpenseSummaryDto, ExpenseCategory } from '@/features/expenses/api/expensesApi';

/**
 * English demo expenses for Emma & James's wedding
 * Total budget: ~€25,850
 */
export const DEMO_EXPENSES_EN: WeddingExpenseDto[] = [
  {
    id: 'expense-1',
    weddingId: 'demo',
    amount: 8500,
    category: 0 as ExpenseCategory, // Venue
    description: 'Willowbrook Manor - Venue Rental',
    date: '2026-01-15T00:00:00Z',
    notes: 'Includes ceremony and reception spaces, accommodation for bride and groom',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'expense-2',
    weddingId: 'demo',
    amount: 6400,
    category: 1 as ExpenseCategory, // Catering
    description: 'Catering (80 guests)',
    date: '2026-02-01T00:00:00Z',
    notes: '3-course dinner with wine, canapés during cocktail hour',
    createdAt: '2026-02-01T14:00:00Z',
    updatedAt: '2026-02-01T14:00:00Z',
  },
  {
    id: 'expense-3',
    weddingId: 'demo',
    amount: 3200,
    category: 2 as ExpenseCategory, // Photography
    description: 'Photography & Videography',
    date: '2026-02-10T00:00:00Z',
    notes: 'Full day coverage, drone footage, online gallery',
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
  },
  {
    id: 'expense-4',
    weddingId: 'demo',
    amount: 1800,
    category: 3 as ExpenseCategory, // Decoration
    description: 'Florist - Flowers & Arrangements',
    date: '2026-03-01T00:00:00Z',
    notes: 'Bridal bouquet, buttonholes, ceremony arch, table centrepieces',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'expense-5',
    weddingId: 'demo',
    amount: 2500,
    category: 4 as ExpenseCategory, // Attire
    description: 'Wedding Dress',
    date: '2026-03-15T00:00:00Z',
    notes: 'Designer gown with alterations',
    createdAt: '2026-03-15T15:00:00Z',
    updatedAt: '2026-03-15T15:00:00Z',
  },
  {
    id: 'expense-6',
    weddingId: 'demo',
    amount: 800,
    category: 4 as ExpenseCategory, // Attire
    description: 'Groom\'s Suit',
    date: '2026-03-20T00:00:00Z',
    notes: 'Tailored suit with accessories',
    createdAt: '2026-03-20T12:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z',
  },
  {
    id: 'expense-7',
    weddingId: 'demo',
    amount: 450,
    category: 5 as ExpenseCategory, // Transport
    description: 'Vintage Car Hire',
    date: '2026-04-01T00:00:00Z',
    notes: 'Classic Bentley for ceremony arrival and departure',
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'expense-8',
    weddingId: 'demo',
    amount: 650,
    category: 1 as ExpenseCategory, // Catering
    description: 'Wedding Cake',
    date: '2026-04-10T00:00:00Z',
    notes: '4-tier white cake with fresh flowers',
    createdAt: '2026-04-10T13:00:00Z',
    updatedAt: '2026-04-10T13:00:00Z',
  },
  {
    id: 'expense-9',
    weddingId: 'demo',
    amount: 1200,
    category: 6 as ExpenseCategory, // Other
    description: 'DJ & Entertainment',
    date: '2026-04-15T00:00:00Z',
    notes: 'Evening entertainment, sound system, lighting',
    createdAt: '2026-04-15T16:00:00Z',
    updatedAt: '2026-04-15T16:00:00Z',
  },
  {
    id: 'expense-10',
    weddingId: 'demo',
    amount: 350,
    category: 6 as ExpenseCategory, // Other
    description: 'Invitations & Stationery',
    date: '2026-01-20T00:00:00Z',
    notes: 'Printed invitations, save-the-dates, table cards, menu cards',
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
];

/**
 * Pre-calculated expense summary for the English demo wedding
 */
export const DEMO_EXPENSE_SUMMARY_EN: WeddingExpenseSummaryDto = {
  totalAmount: DEMO_EXPENSES_EN.reduce((sum, exp) => sum + (exp.amount ?? 0), 0),
  categoryTotals: {
    Venue: 8500,
    Catering: 7050,
    Photography: 3200,
    Decoration: 1800,
    Attire: 3300,
    Transport: 450,
    Other: 1550,
  },
  expenses: DEMO_EXPENSES_EN,
};
