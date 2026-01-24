import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function HomePage() {
  const { t } = useTranslation('common');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight">{t('appName')}</h1>
        <p className="text-xl text-muted-foreground">{t('tagline')}</p>
        <div className="flex gap-4 justify-center mt-8">
          <Button asChild size="lg">
            <Link to="/login">{t('auth:login.title')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/register">{t('auth:register.title')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
