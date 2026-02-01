import type { WeddingExpenseDto, WeddingExpenseSummaryDto, ExpenseCategory } from '@/features/expenses/api/expensesApi';

/**
 * French demo expenses for Emma & Louis's wedding
 * Total budget: ~€25,850
 */
export const DEMO_EXPENSES_FR: WeddingExpenseDto[] = [
  {
    id: 'expense-1',
    weddingId: 'demo',
    amount: 8500,
    category: 0 as ExpenseCategory, // Venue
    description: 'Château de Chantilly - Location',
    date: '2026-01-15T00:00:00Z',
    notes: 'Comprend les espaces cérémonie et réception, hébergement des mariés',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'expense-2',
    weddingId: 'demo',
    amount: 6400,
    category: 1 as ExpenseCategory, // Catering
    description: 'Traiteur (80 invités)',
    date: '2026-02-01T00:00:00Z',
    notes: 'Dîner 3 plats avec vin, amuse-bouches pendant le cocktail',
    createdAt: '2026-02-01T14:00:00Z',
    updatedAt: '2026-02-01T14:00:00Z',
  },
  {
    id: 'expense-3',
    weddingId: 'demo',
    amount: 3200,
    category: 2 as ExpenseCategory, // Photography
    description: 'Photographie & Vidéo',
    date: '2026-02-10T00:00:00Z',
    notes: 'Couverture journée complète, prises de vue drone, galerie en ligne',
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
  },
  {
    id: 'expense-4',
    weddingId: 'demo',
    amount: 1800,
    category: 3 as ExpenseCategory, // Decoration
    description: 'Fleuriste - Fleurs & Compositions',
    date: '2026-03-01T00:00:00Z',
    notes: 'Bouquet de mariée, boutonnières, arche de cérémonie, centres de table',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'expense-5',
    weddingId: 'demo',
    amount: 2500,
    category: 4 as ExpenseCategory, // Attire
    description: 'Robe de mariée',
    date: '2026-03-15T00:00:00Z',
    notes: 'Robe de créateur avec retouches',
    createdAt: '2026-03-15T15:00:00Z',
    updatedAt: '2026-03-15T15:00:00Z',
  },
  {
    id: 'expense-6',
    weddingId: 'demo',
    amount: 800,
    category: 4 as ExpenseCategory, // Attire
    description: 'Costume du marié',
    date: '2026-03-20T00:00:00Z',
    notes: 'Costume sur mesure avec accessoires',
    createdAt: '2026-03-20T12:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z',
  },
  {
    id: 'expense-7',
    weddingId: 'demo',
    amount: 450,
    category: 5 as ExpenseCategory, // Transport
    description: 'Location voiture de collection',
    date: '2026-04-01T00:00:00Z',
    notes: 'Citroën DS classique pour arrivée et départ de la cérémonie',
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'expense-8',
    weddingId: 'demo',
    amount: 650,
    category: 1 as ExpenseCategory, // Catering
    description: 'Pièce montée',
    date: '2026-04-10T00:00:00Z',
    notes: 'Gâteau 4 étages blanc avec fleurs fraîches',
    createdAt: '2026-04-10T13:00:00Z',
    updatedAt: '2026-04-10T13:00:00Z',
  },
  {
    id: 'expense-9',
    weddingId: 'demo',
    amount: 1200,
    category: 6 as ExpenseCategory, // Other
    description: 'DJ & Animation',
    date: '2026-04-15T00:00:00Z',
    notes: 'Animation de soirée, système son, éclairage',
    createdAt: '2026-04-15T16:00:00Z',
    updatedAt: '2026-04-15T16:00:00Z',
  },
  {
    id: 'expense-10',
    weddingId: 'demo',
    amount: 350,
    category: 6 as ExpenseCategory, // Other
    description: 'Faire-part & Papeterie',
    date: '2026-01-20T00:00:00Z',
    notes: 'Invitations imprimées, save-the-date, marque-places, menus',
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
];

/**
 * Pre-calculated expense summary for the French demo wedding
 */
export const DEMO_EXPENSE_SUMMARY_FR: WeddingExpenseSummaryDto = {
  totalAmount: DEMO_EXPENSES_FR.reduce((sum, exp) => sum + (exp.amount ?? 0), 0),
  categoryTotals: {
    Venue: 8500,
    Catering: 7050,
    Photography: 3200,
    Decoration: 1800,
    Attire: 3300,
    Transport: 450,
    Other: 1550,
  },
  expenses: DEMO_EXPENSES_FR,
};
