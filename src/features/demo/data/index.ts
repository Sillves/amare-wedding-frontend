import type { Wedding } from '@/features/weddings/types';
import type { GuestDto, EventDto } from '@/features/weddings/types';
import type { WeddingExpenseDto, WeddingExpenseSummaryDto } from '@/features/expenses/api/expensesApi';
import type { WeddingWebsite } from '@/features/website/types';

// English data
import { DEMO_WEDDING_EN, DEMO_WEDDING_PUBLIC_EN } from './mockWedding.en';
import { DEMO_GUESTS_EN } from './mockGuests.en';
import { DEMO_EVENTS_EN } from './mockEvents.en';
import { DEMO_EXPENSES_EN, DEMO_EXPENSE_SUMMARY_EN } from './mockExpenses.en';
import { DEMO_WEBSITE_EN } from './mockWebsite.en';

// Dutch data
import { DEMO_WEDDING_NL, DEMO_WEDDING_PUBLIC_NL } from './mockWedding.nl';
import { DEMO_GUESTS_NL } from './mockGuests.nl';
import { DEMO_EVENTS_NL } from './mockEvents.nl';
import { DEMO_EXPENSES_NL, DEMO_EXPENSE_SUMMARY_NL } from './mockExpenses.nl';
import { DEMO_WEBSITE_NL } from './mockWebsite.nl';

// French data
import { DEMO_WEDDING_FR, DEMO_WEDDING_PUBLIC_FR } from './mockWedding.fr';
import { DEMO_GUESTS_FR } from './mockGuests.fr';
import { DEMO_EVENTS_FR } from './mockEvents.fr';
import { DEMO_EXPENSES_FR, DEMO_EXPENSE_SUMMARY_FR } from './mockExpenses.fr';
import { DEMO_WEBSITE_FR } from './mockWebsite.fr';

export type SupportedLanguage = 'en' | 'nl' | 'fr';

interface LocalizedDemoData {
  wedding: Wedding;
  weddingPublic: { id: string; title: string; slug: string; date: string; location: string };
  guests: GuestDto[];
  events: EventDto[];
  expenses: WeddingExpenseDto[];
  expenseSummary: WeddingExpenseSummaryDto;
  website: WeddingWebsite;
}

const demoDataByLanguage: Record<SupportedLanguage, LocalizedDemoData> = {
  en: {
    wedding: DEMO_WEDDING_EN,
    weddingPublic: DEMO_WEDDING_PUBLIC_EN,
    guests: DEMO_GUESTS_EN,
    events: DEMO_EVENTS_EN,
    expenses: DEMO_EXPENSES_EN,
    expenseSummary: DEMO_EXPENSE_SUMMARY_EN,
    website: DEMO_WEBSITE_EN,
  },
  nl: {
    wedding: DEMO_WEDDING_NL,
    weddingPublic: DEMO_WEDDING_PUBLIC_NL,
    guests: DEMO_GUESTS_NL,
    events: DEMO_EVENTS_NL,
    expenses: DEMO_EXPENSES_NL,
    expenseSummary: DEMO_EXPENSE_SUMMARY_NL,
    website: DEMO_WEBSITE_NL,
  },
  fr: {
    wedding: DEMO_WEDDING_FR,
    weddingPublic: DEMO_WEDDING_PUBLIC_FR,
    guests: DEMO_GUESTS_FR,
    events: DEMO_EVENTS_FR,
    expenses: DEMO_EXPENSES_FR,
    expenseSummary: DEMO_EXPENSE_SUMMARY_FR,
    website: DEMO_WEBSITE_FR,
  },
};

/**
 * Get demo data for the specified language
 * Falls back to English if the language is not supported
 */
export function getDemoData(language: string): LocalizedDemoData {
  const lang = (language?.substring(0, 2) as SupportedLanguage) || 'en';
  return demoDataByLanguage[lang] || demoDataByLanguage.en;
}

// Re-export for backward compatibility
export { DEMO_WEDDING_EN as DEMO_WEDDING } from './mockWedding.en';
export { DEMO_WEDDING_PUBLIC_EN as DEMO_WEDDING_PUBLIC } from './mockWedding.en';
export { DEMO_GUESTS_EN as DEMO_GUESTS } from './mockGuests.en';
export { DEMO_EVENTS_EN as DEMO_EVENTS } from './mockEvents.en';
export { DEMO_EXPENSES_EN as DEMO_EXPENSES, DEMO_EXPENSE_SUMMARY_EN as DEMO_EXPENSE_SUMMARY } from './mockExpenses.en';
