import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getDemoData } from '../data';
import type { Wedding } from '@/features/weddings/types';

interface UseDemoWeddingsReturn {
  data: Wedding[];
  isLoading: false;
  error: null;
}

/**
 * Demo version of useWeddings hook
 * Returns the demo wedding wrapped in an array
 * Data is localized based on the current language
 */
export function useDemoWeddings(): UseDemoWeddingsReturn {
  const { i18n } = useTranslation();
  const data = useMemo(() => [getDemoData(i18n.language).wedding], [i18n.language]);

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
 * Data is localized based on the current language
 */
export function useDemoWedding(): UseDemoWeddingReturn {
  const { i18n } = useTranslation();
  const wedding = useMemo(() => getDemoData(i18n.language).wedding, [i18n.language]);

  return {
    data: wedding,
    isLoading: false,
    error: null,
  };
}
