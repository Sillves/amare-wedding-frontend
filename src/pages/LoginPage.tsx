import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SEO } from '@/shared/components/seo';
import { Button } from '@/components/ui/button';

export function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <>
      <SEO page="login" />
      <div className="relative flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToHome')}
        </Button>
        <LoginForm />
      </div>
    </>
  );
}
