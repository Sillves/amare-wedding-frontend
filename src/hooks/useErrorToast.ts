import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/errorHandler';

/**
 * Hook for displaying error messages as toasts
 * Automatically translates backend error messages
 */
export function useErrorToast() {
  const { t } = useTranslation('common');

  const showError = useCallback(
    (error: unknown, fallbackMessage?: string) => {
      const message = getErrorMessage(error) || fallbackMessage || t('errors.generic');
      toast({
        variant: 'destructive',
        title: t('error'),
        description: message,
      });
    },
    [t]
  );

  const showSuccess = useCallback(
    (message: string) => {
      toast({
        title: t('success'),
        description: message,
      });
    },
    [t]
  );

  return { showError, showSuccess };
}
