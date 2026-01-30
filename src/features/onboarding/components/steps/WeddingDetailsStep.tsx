import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-time-picker';
import { WizardFormData } from '../../types';

interface WeddingDetailsStepProps {
  form: UseFormReturn<WizardFormData>;
}

export function WeddingDetailsStep({ form }: WeddingDetailsStepProps) {
  const { t } = useTranslation('weddings');
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const dateNotDecided = watch('dateNotDecided');
  const date = watch('date');

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">{t('wizard.details.title')}</h2>
        <p className="text-muted-foreground">{t('wizard.details.subtitle')}</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="title">{t('wizard.details.weddingName')}</Label>
          <Input
            id="title"
            placeholder={t('wizard.details.weddingNamePlaceholder')}
            {...register('title')}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{t(errors.title.message!)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t('wizard.details.weddingDate')}</Label>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <DatePicker
              date={date}
              onDateChange={(newDate) => setValue('date', newDate)}
              disabled={dateNotDecided}
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="dateNotDecided"
              checked={dateNotDecided}
              onCheckedChange={(checked) => {
                setValue('dateNotDecided', checked === true);
                if (checked) {
                  setValue('date', undefined);
                }
              }}
            />
            <Label htmlFor="dateNotDecided" className="text-sm font-normal cursor-pointer">
              {t('wizard.details.dateNotDecided')}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
