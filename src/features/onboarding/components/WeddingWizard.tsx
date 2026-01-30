import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useWeddingWizard } from '../hooks/useWeddingWizard';
import { WizardStepper } from './WizardStepper';
import { WizardNavigation } from './WizardNavigation';
import { WelcomeStep } from './steps/WelcomeStep';
import { WeddingDetailsStep } from './steps/WeddingDetailsStep';
import { PartnerNamesStep } from './steps/PartnerNamesStep';
import { LocationStep } from './steps/LocationStep';
import { FirstGuestStep } from './steps/FirstGuestStep';
import { CompleteStep } from './steps/CompleteStep';

export function WeddingWizard() {
  const { t } = useTranslation('weddings');
  const {
    currentStep,
    nextStep,
    prevStep,
    skipStep,
    isOptionalStep,
    canGoBack,
    isLastStep,
    form,
    submitWizard,
    isSubmitting,
    error,
  } = useWeddingWizard();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
      case 2:
        return <WeddingDetailsStep form={form} />;
      case 3:
        return <PartnerNamesStep form={form} />;
      case 4:
        return <LocationStep form={form} />;
      case 5:
        return <FirstGuestStep form={form} />;
      case 6:
        return (
          <CompleteStep
            form={form}
            onComplete={submitWizard}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  // Step 1 and 6 have their own navigation
  const showNavigation = currentStep > 1 && currentStep < 6;

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <WizardStepper currentStep={currentStep} />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
        {renderStep()}

        {showNavigation && (
          <WizardNavigation
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={isOptionalStep ? skipStep : undefined}
            canGoBack={canGoBack}
            isOptionalStep={isOptionalStep}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
