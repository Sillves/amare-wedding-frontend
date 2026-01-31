import { useCallback } from 'react';
import { useDemoContext } from '../context/DemoContext';
import type { GuestDto, RsvpStatus } from '@/features/weddings/types';

interface UseDemoGuestsReturn {
  data: GuestDto[];
  isLoading: false;
  error: null;
}

/**
 * Demo version of useGuests hook
 * Returns guests from DemoContext (includes local updates)
 */
export function useDemoGuests(): UseDemoGuestsReturn {
  const { guests } = useDemoContext();

  return {
    data: guests,
    isLoading: false,
    error: null,
  };
}

interface SubmitRsvpParams {
  weddingId: string;
  data: {
    name: string | null;
    email: string | null;
    rsvpStatus: RsvpStatus;
  };
}

interface UseDemoSubmitRsvpReturn {
  mutateAsync: (params: SubmitRsvpParams) => Promise<void>;
  isPending: boolean;
}

/**
 * Demo version of useSubmitRsvp hook
 * Adds new guest to DemoContext
 */
export function useDemoSubmitRsvp(): UseDemoSubmitRsvpReturn {
  const { addGuest } = useDemoContext();

  const mutateAsync = useCallback(
    async (params: SubmitRsvpParams): Promise<void> => {
      // Simulate a small delay like a real API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      addGuest({
        name: params.data.name,
        email: params.data.email,
        rsvpStatus: params.data.rsvpStatus,
        preferredLanguage: 'en',
      });
    },
    [addGuest]
  );

  return {
    mutateAsync,
    isPending: false,
  };
}
