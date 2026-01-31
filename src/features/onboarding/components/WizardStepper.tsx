import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WIZARD_STEPS } from '../types';

interface WizardStepperProps {
  currentStep: number;
}

export function WizardStepper({ currentStep }: WizardStepperProps) {
  const { t } = useTranslation('weddings');

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isLast = index === WIZARD_STEPS.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isCurrent && 'bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/20',
                    !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : step.id}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center hidden sm:block',
                    isCurrent && 'text-primary',
                    !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {t(step.labelKey)}
                  {step.optional && (
                    <span className="block text-[10px] text-muted-foreground/70">
                      ({t('wizard.navigation.skip')})
                    </span>
                  )}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
