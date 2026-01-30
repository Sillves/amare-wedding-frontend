import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WizardNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  onSkip?: () => void;
  canGoBack: boolean;
  isOptionalStep: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
}

export function WizardNavigation({
  onNext,
  onPrev,
  onSkip,
  canGoBack,
  isOptionalStep,
  isLastStep,
  isSubmitting = false,
  nextLabel,
}: WizardNavigationProps) {
  const { t } = useTranslation('weddings');

  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t">
      <div>
        {canGoBack && (
          <Button variant="ghost" onClick={onPrev} disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('wizard.navigation.back')}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        {isOptionalStep && onSkip && (
          <Button variant="outline" onClick={onSkip} disabled={isSubmitting}>
            {t('wizard.navigation.skip')}
          </Button>
        )}
        <Button onClick={onNext} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t('wizard.navigation.complete')}
            </span>
          ) : (
            <>
              {nextLabel || (isLastStep ? t('wizard.navigation.complete') : t('wizard.navigation.next'))}
              {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
