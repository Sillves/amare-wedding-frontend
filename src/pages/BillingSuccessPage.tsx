import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function BillingSuccessPage() {
  const { t } = useTranslation(['billing', 'common']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(5);

  // Fetch fresh user data to get updated subscription tier
  // The backend webhook updates the DB, so we need to refetch
  const { refetchUser, isLoading: isRefreshing } = useCurrentUser();

  // Get session_id from URL (Stripe includes this on redirect)
  const sessionId = searchParams.get('session_id');

  // Refresh user data on mount to get updated subscription status
  useEffect(() => {
    if (isAuthenticated) {
      refetchUser();
    }
  }, [isAuthenticated, refetchUser]);

  // Auto-redirect to dashboard after countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/dashboard');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">{t('billing:success.title')}</CardTitle>
          <CardDescription>
            {t('billing:success.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('billing:success.processingNote')}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => navigate('/dashboard')}
            >
              {t('billing:success.goToDashboard')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t('billing:success.redirecting', { seconds: countdown })}
            </p>
          </div>

          {sessionId && (
            <p className="text-xs text-center text-muted-foreground">
              {t('billing:success.sessionId')}: {sessionId.substring(0, 20)}...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
