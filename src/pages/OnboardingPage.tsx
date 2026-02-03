import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WeddingWizard } from '@/features/onboarding';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';

export function OnboardingPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { data: weddings, isLoading } = useWeddings();

  // If user already has weddings, redirect to dashboard
  useEffect(() => {
    if (!isLoading && weddings && weddings.length > 0) {
      navigate('/dashboard', { replace: true });
    }
  }, [weddings, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-2xl font-script text-primary">{t('appName')}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 sm:gap-3">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 md:py-12">
        <WeddingWizard />
      </main>
    </div>
  );
}
