import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WizardFormData } from '../../types';

interface LocationStepProps {
  form: UseFormReturn<WizardFormData>;
}

export function LocationStep({ form }: LocationStepProps) {
  const { t } = useTranslation('weddings');
  const { register } = form;

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">{t('wizard.location.title')}</h2>
        <p className="text-muted-foreground">{t('wizard.location.subtitle')}</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="location">{t('wizard.location.title')}</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="location"
              placeholder={t('wizard.location.locationPlaceholder')}
              className="pl-10"
              {...register('location')}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {t('wizard.location.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
