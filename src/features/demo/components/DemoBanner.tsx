import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DemoBannerProps {
  className?: string;
}

/**
 * Banner displayed on demo pages to indicate demo mode
 * Shows a friendly message that changes won't be saved
 */
export function DemoBanner({ className = '' }: DemoBannerProps) {
  const { t } = useTranslation(['demo']);

  return (
    <Alert
      className={`border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50 ${className}`}
    >
      <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        {t('demo:banner.message')}
      </AlertDescription>
    </Alert>
  );
}
