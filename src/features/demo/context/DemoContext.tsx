import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuestDto, RsvpStatus, EventDto } from '@/features/weddings/types';
import type { WeddingExpenseDto, WeddingExpenseSummaryDto } from '@/features/expenses/api/expensesApi';
import { getDemoData } from '../data';

// Category labels for summary calculation
const CATEGORY_LABELS: Record<number, string> = {
  0: 'Venue',
  1: 'Catering',
  2: 'Photography',
  3: 'Decoration',
  4: 'Attire',
  5: 'Transport',
  6: 'Other',
};

interface DemoContextType {
  // Guests
  guests: GuestDto[];
  addGuest: (guest: Omit<GuestDto, 'id' | 'weddingId' | 'invitationSentAt'>) => GuestDto;
  updateGuest: (guestId: string, updates: Partial<GuestDto>) => void;
  deleteGuest: (guestId: string) => void;
  updateGuestRsvp: (guestId: string, status: RsvpStatus, name?: string, email?: string) => void;

  // Events
  events: EventDto[];
  addEvent: (event: Omit<EventDto, 'id' | 'weddingId'>) => EventDto;
  updateEvent: (eventId: string, updates: Partial<EventDto>) => void;
  deleteEvent: (eventId: string) => void;
  addGuestsToEvent: (eventId: string, guestIds: string[]) => void;
  removeGuestsFromEvent: (eventId: string, guestIds: string[]) => void;

  // Expenses
  expenses: WeddingExpenseDto[];
  expenseSummary: WeddingExpenseSummaryDto;
  addExpense: (expense: Omit<WeddingExpenseDto, 'id' | 'weddingId' | 'createdAt' | 'updatedAt'>) => WeddingExpenseDto;
  updateExpense: (expenseId: string, updates: Partial<WeddingExpenseDto>) => void;
  deleteExpense: (expenseId: string) => void;

  // Utility
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextType | null>(null);

interface DemoProviderProps {
  children: ReactNode;
}

/**
 * Provider for demo mode local state
 * Manages guests, events, and expenses in memory
 * Data is localized based on the current language
 */
export function DemoProvider({ children }: DemoProviderProps) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Get initial data based on current language
  const initialData = getDemoData(currentLanguage);

  const [guests, setGuests] = useState<GuestDto[]>(initialData.guests);
  const [events, setEvents] = useState<EventDto[]>(initialData.events);
  const [expenses, setExpenses] = useState<WeddingExpenseDto[]>(initialData.expenses);

  // Reset data when language changes
  useEffect(() => {
    const data = getDemoData(currentLanguage);
    setGuests(data.guests);
    setEvents(data.events);
    setExpenses(data.expenses);
  }, [currentLanguage]);

  // ==================== GUESTS ====================

  const addGuest = useCallback((guestData: Omit<GuestDto, 'id' | 'weddingId' | 'invitationSentAt'>): GuestDto => {
    const newGuest: GuestDto = {
      ...guestData,
      id: `demo-guest-${Date.now()}`,
      weddingId: 'demo',
      invitationSentAt: null,
    };
    setGuests((prev) => [...prev, newGuest]);
    return newGuest;
  }, []);

  const updateGuest = useCallback((guestId: string, updates: Partial<GuestDto>) => {
    setGuests((prev) =>
      prev.map((guest) => (guest.id === guestId ? { ...guest, ...updates } : guest))
    );
  }, []);

  const deleteGuest = useCallback((guestId: string) => {
    setGuests((prev) => prev.filter((guest) => guest.id !== guestId));
  }, []);

  const updateGuestRsvp = useCallback((guestId: string, status: RsvpStatus, name?: string, email?: string) => {
    setGuests((prev) =>
      prev.map((guest) =>
        guest.id === guestId
          ? {
              ...guest,
              rsvpStatus: status,
              ...(name && { name }),
              ...(email !== undefined && { email }),
            }
          : guest
      )
    );
  }, []);

  // ==================== EVENTS ====================

  const addEvent = useCallback((eventData: Omit<EventDto, 'id' | 'weddingId'>): EventDto => {
    const newEvent: EventDto = {
      ...eventData,
      id: `demo-event-${Date.now()}`,
      weddingId: 'demo',
    };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((eventId: string, updates: Partial<EventDto>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, ...updates } : event))
    );
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  }, []);

  const addGuestsToEvent = useCallback((eventId: string, guestIds: string[]) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;

        const existingGuestIds = new Set(event.guestDtos?.map(g => g.id) || []);
        const newGuestDtos = guests.filter(
          (g) => guestIds.includes(g.id!) && !existingGuestIds.has(g.id)
        );

        return {
          ...event,
          guestDtos: [...(event.guestDtos || []), ...newGuestDtos],
        };
      })
    );
  }, [guests]);

  const removeGuestsFromEvent = useCallback((eventId: string, guestIds: string[]) => {
    const guestIdSet = new Set(guestIds);
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;

        return {
          ...event,
          guestDtos: (event.guestDtos || []).filter((g) => !guestIdSet.has(g.id!)),
        };
      })
    );
  }, []);

  // ==================== EXPENSES ====================

  const addExpense = useCallback(
    (expenseData: Omit<WeddingExpenseDto, 'id' | 'weddingId' | 'createdAt' | 'updatedAt'>): WeddingExpenseDto => {
      const now = new Date().toISOString();
      const newExpense: WeddingExpenseDto = {
        ...expenseData,
        id: `demo-expense-${Date.now()}`,
        weddingId: 'demo',
        createdAt: now,
        updatedAt: now,
      };
      setExpenses((prev) => [...prev, newExpense]);
      return newExpense;
    },
    []
  );

  const updateExpense = useCallback((expenseId: string, updates: Partial<WeddingExpenseDto>) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === expenseId
          ? { ...expense, ...updates, updatedAt: new Date().toISOString() }
          : expense
      )
    );
  }, []);

  const deleteExpense = useCallback((expenseId: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
  }, []);

  // Calculate expense summary dynamically
  const expenseSummary = useMemo((): WeddingExpenseSummaryDto => {
    const categoryTotals: Record<string, number> = {};

    expenses.forEach((expense) => {
      const categoryLabel = CATEGORY_LABELS[expense.category as number] || 'Other';
      categoryTotals[categoryLabel] = (categoryTotals[categoryLabel] || 0) + (expense.amount ?? 0);
    });

    return {
      totalAmount: expenses.reduce((sum, exp) => sum + (exp.amount ?? 0), 0),
      categoryTotals,
      expenses,
    };
  }, [expenses]);

  // ==================== UTILITY ====================

  const resetDemo = useCallback(() => {
    const data = getDemoData(currentLanguage);
    setGuests(data.guests);
    setEvents(data.events);
    setExpenses(data.expenses);
  }, [currentLanguage]);

  const value = useMemo(
    () => ({
      guests,
      addGuest,
      updateGuest,
      deleteGuest,
      updateGuestRsvp,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      addGuestsToEvent,
      removeGuestsFromEvent,
      expenses,
      expenseSummary,
      addExpense,
      updateExpense,
      deleteExpense,
      resetDemo,
    }),
    [
      guests,
      addGuest,
      updateGuest,
      deleteGuest,
      updateGuestRsvp,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      addGuestsToEvent,
      removeGuestsFromEvent,
      expenses,
      expenseSummary,
      addExpense,
      updateExpense,
      deleteExpense,
      resetDemo,
    ]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

/**
 * Hook to access demo context
 * Must be used within a DemoProvider
 */
export function useDemoContext(): DemoContextType {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
}

/**
 * Hook to optionally access demo context
 * Returns null if not within a DemoProvider
 */
export function useDemoContextOptional(): DemoContextType | null {
  return useContext(DemoContext);
}
