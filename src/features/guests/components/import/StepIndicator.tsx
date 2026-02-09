import { useTranslation } from 'react-i18next';
import type { ImportStep } from '../../types/importTypes';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: ImportStep;
}

const STEPS: ImportStep[] = ['upload', 'mapping', 'preview', 'result'];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useTranslation('guests');
  const currentIndex = STEPS.indexOf(currentStep);

  const labels = [
    t('import.steps.upload'),
    t('import.steps.mapping'),
    t('import.steps.preview'),
    t('import.steps.result'),
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-3 h-3 rounded-full transition-colors',
                index < currentIndex && 'bg-primary',
                index === currentIndex && 'bg-primary ring-2 ring-primary/30',
                index > currentIndex && 'bg-muted'
              )}
            />
            <span
              className={cn(
                'text-xs hidden sm:block',
                index === currentIndex ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}
            >
              {labels[index]}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={cn(
                'w-8 h-0.5 mb-4 sm:mb-0',
                index < currentIndex ? 'bg-primary' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
