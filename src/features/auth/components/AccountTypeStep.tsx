import { useTranslation } from 'react-i18next';
import { Heart, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AccountTypeStepProps {
  onSelect: (accountType: number) => void;
}

export function AccountTypeStep({ onSelect }: AccountTypeStepProps) {
  const { t } = useTranslation('auth');

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('register.accountType.title')}</h2>
        <p className="text-muted-foreground">{t('register.accountType.subtitle')}</p>
      </div>

      <div className="grid gap-4">
        <Card
          className="cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
          onClick={() => onSelect(0)}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
              <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold">{t('register.accountType.couple')}</h3>
              <p className="text-sm text-muted-foreground">{t('register.accountType.coupleDescription')}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
          onClick={() => onSelect(1)}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">{t('register.accountType.planner')}</h3>
              <p className="text-sm text-muted-foreground">{t('register.accountType.plannerDescription')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
