import { useMemo } from 'react';
import { DEMO_WEDDING } from '../data/mockWedding';
import type { Wedding } from '@/features/weddings/types';

interface UseDemoWeddingsReturn {
  data: Wedding[];
  isLoading: false;
  error: null;
}

/**
 * Demo version of useWeddings hook
 * Returns the demo wedding wrapped in an array
 */
export function useDemoWeddings(): UseDemoWeddingsReturn {
  const data = useMemo(() => [DEMO_WEDDING], []);

  return {
    data,
    isLoading: false,
    error: null,
  };
}

interface UseDemoWeddingReturn {
  data: Wedding;
  isLoading: false;
  error: null;
}

/**
 * Demo version of useWedding hook
 * Returns the demo wedding
 */
export function useDemoWedding(): UseDemoWeddingReturn {
  return {
    data: DEMO_WEDDING,
    isLoading: false,
    error: null,
  };
}
