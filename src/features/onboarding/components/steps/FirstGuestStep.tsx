import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { User, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WizardFormData } from '../../types';

interface FirstGuestStepProps {
  form: UseFormReturn<WizardFormData>;
}

export function FirstGuestStep({ form }: FirstGuestStepProps) {
  const { t } = useTranslation('weddings');
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">{t('wizard.guest.title')}</h2>
        <p className="text-muted-foreground">{t('wizard.guest.subtitle')}</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="firstGuestName">{t('wizard.guest.guestName')}</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="firstGuestName"
              placeholder={t('wizard.guest.guestNamePlaceholder')}
              className="pl-10"
              {...register('firstGuestName')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstGuestEmail">{t('wizard.guest.guestEmail')}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="firstGuestEmail"
              type="email"
              placeholder={t('wizard.guest.guestEmailPlaceholder')}
              className="pl-10"
              {...register('firstGuestEmail')}
            />
          </div>
          {errors.firstGuestEmail && (
            <p className="text-sm text-destructive">
              {t(errors.firstGuestEmail.message!)}
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground text-center">
          {t('wizard.guest.description')}
        </p>
      </div>
    </div>
  );
}
