import { useMemo } from 'react';
import { DEMO_EVENTS } from '../data/mockEvents';
import type { EventDto } from '@/features/weddings/types';

interface UseDemoEventsReturn {
  data: EventDto[];
  isLoading: false;
  error: null;
}

/**
 * Demo version of useEvents hook
 * Returns mock events for the demo wedding
 */
export function useDemoEvents(): UseDemoEventsReturn {
  // Memoize to prevent unnecessary re-renders
  const data = useMemo(() => DEMO_EVENTS, []);

  return {
    data,
    isLoading: false,
    error: null,
  };
}
