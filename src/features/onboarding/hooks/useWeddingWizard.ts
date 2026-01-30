import { useState, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useCreateWedding } from '@/features/weddings/hooks/useWeddings';
import { useCreateGuest } from '@/features/guests/hooks/useGuests';
import { wizardSchema, WizardFormData, WIZARD_STEPS, STEP_FIELDS } from '../types';

export interface UseWeddingWizardReturn {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  skipStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isOptionalStep: boolean;
  canGoBack: boolean;
  form: UseFormReturn<WizardFormData>;
  submitWizard: () => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function useWeddingWizard(): UseWeddingWizardReturn {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createWedding = useCreateWedding();
  const createGuest = useCreateGuest();

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      title: '',
      date: undefined,
      dateNotDecided: false,
      partner1Name: '',
      partner2Name: '',
      location: '',
      firstGuestName: '',
      firstGuestEmail: '',
    },
    mode: 'onBlur',
  });

  const totalSteps = WIZARD_STEPS.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const currentStepConfig = WIZARD_STEPS.find((s) => s.id === currentStep);
  const isOptionalStep = currentStepConfig?.optional ?? false;
  const canGoBack = currentStep > 1 && currentStep < totalSteps;

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (fieldsToValidate.length === 0) {
      return true;
    }
    return await form.trigger(fieldsToValidate);
  }, [currentStep, form]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const nextStep = useCallback(async (): Promise<boolean> => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return true;
    }
    return isValid;
  }, [currentStep, totalSteps, validateCurrentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const skipStep = useCallback(() => {
    if (isOptionalStep && currentStep < totalSteps) {
      // Clear optional fields for this step
      if (currentStep === 4) {
        form.setValue('location', '');
      } else if (currentStep === 5) {
        form.setValue('firstGuestName', '');
        form.setValue('firstGuestEmail', '');
      }
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, isOptionalStep, totalSteps, form]);

  const submitWizard = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const data = form.getValues();

      // Prepare wedding date
      let dateString: string | undefined;
      if (data.date && !data.dateNotDecided) {
        // Set to noon UTC to avoid timezone issues
        const date = new Date(data.date);
        date.setUTCHours(12, 0, 0, 0);
        dateString = date.toISOString();
      }

      // Create the wedding
      const wedding = await createWedding.mutateAsync({
        title: data.title,
        date: dateString,
        location: data.location || undefined,
      });

      // Create first guest if provided
      if (data.firstGuestName?.trim()) {
        await createGuest.mutateAsync({
          weddingId: wedding.id,
          data: {
            name: data.firstGuestName.trim(),
            email: data.firstGuestEmail?.trim() || null,
            rsvpStatus: 0, // Pending
          },
        });
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  }, [form, createWedding, createGuest, navigate]);

  return {
    currentStep,
    totalSteps,
    goToStep,
    nextStep,
    prevStep,
    skipStep,
    isFirstStep,
    isLastStep,
    isOptionalStep,
    canGoBack,
    form,
    submitWizard,
    isSubmitting,
    error,
  };
}
