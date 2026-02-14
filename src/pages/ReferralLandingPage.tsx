import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ReferralLandingPage() {
  const { code } = useParams<{ code: string }>();
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      localStorage.setItem('referralCode', code);
    }
  }, [code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Heart className="h-10 w-10 text-primary mx-auto mb-2" />
          <CardTitle>{t('common:referral.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            {t('common:referral.description')}
          </p>
          <Button className="w-full" onClick={() => navigate('/register')}>
            {t('common:referral.cta')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground">
            {t('common:referral.alreadyHaveAccount')}{' '}
            <button
              className="underline hover:text-foreground"
              onClick={() => navigate('/login')}
            >
              {t('common:referral.login')}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
