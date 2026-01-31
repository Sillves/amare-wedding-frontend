import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { GuestDto, RsvpStatus, EventDto } from '@/features/weddings/types';
import type { WeddingExpenseDto, WeddingExpenseSummaryDto, ExpenseCategory } from '@/features/expenses/api/expensesApi';
import { DEMO_GUESTS } from '../data/mockGuests';
import { DEMO_EVENTS } from '../data/mockEvents';
import { DEMO_EXPENSES } from '../data/mockExpenses';

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
 */
export function DemoProvider({ children }: DemoProviderProps) {
  const [guests, setGuests] = useState<GuestDto[]>(DEMO_GUESTS);
  const [events, setEvents] = useState<EventDto[]>(DEMO_EVENTS);
  const [expenses, setExpenses] = useState<WeddingExpenseDto[]>(DEMO_EXPENSES);

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
    setGuests(DEMO_GUESTS);
    setEvents(DEMO_EVENTS);
    setExpenses(DEMO_EXPENSES);
  }, []);

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
