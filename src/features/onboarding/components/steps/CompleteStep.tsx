import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { CheckCircle2, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WizardFormData } from '../../types';

interface CompleteStepProps {
  form: UseFormReturn<WizardFormData>;
  onComplete: () => void;
  isSubmitting: boolean;
}

export function CompleteStep({ form, onComplete, isSubmitting }: CompleteStepProps) {
  const { t, i18n } = useTranslation('weddings');
  const data = form.getValues();

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const summaryItems = [
    {
      icon: CheckCircle2,
      label: t('wizard.complete.weddingCreated'),
      value: data.title,
      show: true,
    },
    {
      icon: Calendar,
      label: data.date && !data.dateNotDecided
        ? t('wizard.complete.dateSet', { date: formatDate(data.date) })
        : t('wizard.complete.dateNotSet'),
      value: null,
      show: true,
    },
    {
      icon: MapPin,
      label: data.location
        ? t('wizard.complete.locationSet', { location: data.location })
        : t('wizard.complete.locationNotSet'),
      value: null,
      show: true,
    },
    {
      icon: Users,
      label: data.firstGuestName
        ? t('wizard.complete.guestAdded')
        : t('wizard.complete.noGuest'),
      value: data.firstGuestName || null,
      show: true,
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-semibold">{t('wizard.complete.title')}</h2>
        <p className="text-muted-foreground">{t('wizard.complete.subtitle')}</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-muted-foreground mb-4">
            {t('wizard.complete.summary')}
          </p>
          <ul className="space-y-3">
            {summaryItems.filter((item) => item.show).map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <item.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">{item.label}</p>
                  {item.value && (
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" onClick={onComplete} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t('wizard.navigation.complete')}
            </span>
          ) : (
            t('wizard.complete.goToDashboard')
          )}
        </Button>
      </div>
    </div>
  );
}
