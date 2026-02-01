import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WizardFormData } from '../../types';

interface PartnerNamesStepProps {
  form: UseFormReturn<WizardFormData>;
}

export function PartnerNamesStep({ form }: PartnerNamesStepProps) {
  const { t } = useTranslation('weddings');
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const partner1Name = watch('partner1Name');
  const partner2Name = watch('partner2Name');

  // Auto-generate title when both partner names are filled
  useEffect(() => {
    if (partner1Name && partner2Name) {
      const currentTitle = getValues('title');
      // Only auto-generate if title is empty or was previously auto-generated
      if (!currentTitle || currentTitle.includes("'s Wedding") || currentTitle.includes("'s Bruiloft") || currentTitle.includes("Mariage de")) {
        const autoTitle = t('wizard.partners.autoTitle', {
          partner1: partner1Name,
          partner2: partner2Name,
        });
        setValue('title', autoTitle);
      }
    }
  }, [partner1Name, partner2Name, setValue, getValues, t]);

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">{t('wizard.partners.title')}</h2>
        <p className="text-muted-foreground">{t('wizard.partners.subtitle')}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
        <div className="w-full sm:flex-1 space-y-2">
          <Label htmlFor="partner1Name" className="block text-center">{t('wizard.partners.partner1')}</Label>
          <Input
            id="partner1Name"
            placeholder={t('wizard.partners.partner1Placeholder')}
            {...register('partner1Name')}
            className="text-center"
          />
          {errors.partner1Name && (
            <p className="text-sm text-destructive text-center">{t(errors.partner1Name.message!)}</p>
          )}
        </div>

        <div className="flex items-center justify-center sm:pt-6">
          <Heart className="h-8 w-8 text-primary fill-primary" />
        </div>

        <div className="w-full sm:flex-1 space-y-2">
          <Label htmlFor="partner2Name" className="block text-center">{t('wizard.partners.partner2')}</Label>
          <Input
            id="partner2Name"
            placeholder={t('wizard.partners.partner2Placeholder')}
            {...register('partner2Name')}
            className="text-center"
          />
          {errors.partner2Name && (
            <p className="text-sm text-destructive text-center">{t(errors.partner2Name.message!)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
