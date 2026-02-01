import type { WeddingExpenseDto, WeddingExpenseSummaryDto, ExpenseCategory } from '@/features/expenses/api/expensesApi';

/**
 * Dutch demo expenses for Emma & Thijs's wedding
 * Total budget: ~€25,850
 */
export const DEMO_EXPENSES_NL: WeddingExpenseDto[] = [
  {
    id: 'expense-1',
    weddingId: 'demo',
    amount: 8500,
    category: 0 as ExpenseCategory, // Venue
    description: 'Kasteel de Haar - Locatiehuur',
    date: '2026-01-15T00:00:00Z',
    notes: 'Inclusief ceremonie en receptieruimtes, overnachting bruidspaar',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'expense-2',
    weddingId: 'demo',
    amount: 6400,
    category: 1 as ExpenseCategory, // Catering
    description: 'Catering (80 gasten)',
    date: '2026-02-01T00:00:00Z',
    notes: '3-gangen diner met wijn, hapjes tijdens borrel',
    createdAt: '2026-02-01T14:00:00Z',
    updatedAt: '2026-02-01T14:00:00Z',
  },
  {
    id: 'expense-3',
    weddingId: 'demo',
    amount: 3200,
    category: 2 as ExpenseCategory, // Photography
    description: 'Fotografie & Video',
    date: '2026-02-10T00:00:00Z',
    notes: 'Hele dag dekking, drone opnames, online galerij',
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
  },
  {
    id: 'expense-4',
    weddingId: 'demo',
    amount: 1800,
    category: 3 as ExpenseCategory, // Decoration
    description: 'Bloemist - Bloemen & Arrangementen',
    date: '2026-03-01T00:00:00Z',
    notes: 'Bruidsboeket, corsages, ceremonieboog, tafeldecoratie',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'expense-5',
    weddingId: 'demo',
    amount: 2500,
    category: 4 as ExpenseCategory, // Attire
    description: 'Trouwjurk',
    date: '2026-03-15T00:00:00Z',
    notes: 'Designer jurk inclusief verstelwerk',
    createdAt: '2026-03-15T15:00:00Z',
    updatedAt: '2026-03-15T15:00:00Z',
  },
  {
    id: 'expense-6',
    weddingId: 'demo',
    amount: 800,
    category: 4 as ExpenseCategory, // Attire
    description: 'Trouwpak bruidegom',
    date: '2026-03-20T00:00:00Z',
    notes: 'Op maat gemaakt pak met accessoires',
    createdAt: '2026-03-20T12:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z',
  },
  {
    id: 'expense-7',
    weddingId: 'demo',
    amount: 450,
    category: 5 as ExpenseCategory, // Transport
    description: 'Klassieke auto huren',
    date: '2026-04-01T00:00:00Z',
    notes: 'Oldtimer Mercedes voor aankomst en vertrek ceremonie',
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'expense-8',
    weddingId: 'demo',
    amount: 650,
    category: 1 as ExpenseCategory, // Catering
    description: 'Bruidstaart',
    date: '2026-04-10T00:00:00Z',
    notes: '4-laags witte taart met verse bloemen',
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
    notes: 'Avondentertainment, geluidsinstallatie, verlichting',
    createdAt: '2026-04-15T16:00:00Z',
    updatedAt: '2026-04-15T16:00:00Z',
  },
  {
    id: 'expense-10',
    weddingId: 'demo',
    amount: 350,
    category: 6 as ExpenseCategory, // Other
    description: 'Uitnodigingen & Drukwerk',
    date: '2026-01-20T00:00:00Z',
    notes: 'Gedrukte uitnodigingen, save-the-dates, tafelkaartjes, menukaarten',
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
];

/**
 * Pre-calculated expense summary for the Dutch demo wedding
 */
export const DEMO_EXPENSE_SUMMARY_NL: WeddingExpenseSummaryDto = {
  totalAmount: DEMO_EXPENSES_NL.reduce((sum, exp) => sum + (exp.amount ?? 0), 0),
  categoryTotals: {
    Venue: 8500,
    Catering: 7050,
    Photography: 3200,
    Decoration: 1800,
    Attire: 3300,
    Transport: 450,
    Other: 1550,
  },
  expenses: DEMO_EXPENSES_NL,
};
