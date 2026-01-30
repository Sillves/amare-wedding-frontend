import { useTranslation } from 'react-i18next';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { t } = useTranslation(['weddings', 'common']);

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="h-12 w-12 text-primary" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-primary/60" />
      </div>

      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-script text-primary">
          {t('weddings:wizard.welcome.title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('weddings:wizard.welcome.subtitle')}
        </p>
        <p className="text-muted-foreground">
          {t('weddings:wizard.welcome.description')}
        </p>
      </div>

      <Button size="lg" onClick={onNext} className="mt-4">
        {t('weddings:wizard.welcome.getStarted')}
      </Button>
    </div>
  );
}
