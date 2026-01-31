import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { GuestDto, RsvpStatus } from '@/features/weddings/types';
import { DEMO_GUESTS } from '../data/mockGuests';

interface DemoContextType {
  /** Current list of guests (includes mock data + any local updates) */
  guests: GuestDto[];
  /** Add a new guest (from RSVP submission) */
  addGuest: (guest: Omit<GuestDto, 'id' | 'weddingId' | 'invitationSentAt'>) => GuestDto;
  /** Update an existing guest's RSVP status */
  updateGuestRsvp: (guestId: string, status: RsvpStatus, name?: string, email?: string) => void;
  /** Reset demo to initial state */
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextType | null>(null);

interface DemoProviderProps {
  children: ReactNode;
}

/**
 * Provider for demo mode local state
 * Manages guests list and RSVP submissions in memory
 */
export function DemoProvider({ children }: DemoProviderProps) {
  const [guests, setGuests] = useState<GuestDto[]>(DEMO_GUESTS);

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

  const resetDemo = useCallback(() => {
    setGuests(DEMO_GUESTS);
  }, []);

  const value = useMemo(
    () => ({
      guests,
      addGuest,
      updateGuestRsvp,
      resetDemo,
    }),
    [guests, addGuest, updateGuestRsvp, resetDemo]
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
