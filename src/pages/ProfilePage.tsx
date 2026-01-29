import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, Mail, CreditCard, Crown, ArrowRight, Settings, Loader2 } from 'lucide-react';
import { useAuth, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { SubscriptionTierLabel, usePortalSession } from '@/features/billing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfilePage() {
  const { t } = useTranslation(['profile', 'common', 'billing']);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLoading } = useCurrentUser();
  const { openPortal, isLoading: isPortalLoading } = usePortalSession();

  const subscriptionTier = user?.subscriptionTier ?? 0;
  const tierName = SubscriptionTierLabel[subscriptionTier] || 'Free';
  const isPaidPlan = subscriptionTier > 0;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            {t('common:appName')}
          </h1>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            {t('profile:backToDashboard')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 max-w-2xl space-y-6">
        <div>
          <h2 className="text-3xl font-bold">{t('profile:title')}</h2>
          <p className="text-muted-foreground">{t('profile:subtitle')}</p>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('profile:accountInfo.title')}
            </CardTitle>
            <CardDescription>{t('profile:accountInfo.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-64" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t('profile:subscription.title')}
            </CardTitle>
            <CardDescription>{t('profile:subscription.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {isPaidPlan && <Crown className="h-5 w-5 text-yellow-500" />}
                    <span className="text-xl font-semibold">
                      {t(`billing:plans.${tierName.toLowerCase()}.name`)}
                    </span>
                    <Badge variant={isPaidPlan ? 'default' : 'secondary'}>
                      {isPaidPlan ? t('profile:subscription.active') : t('profile:subscription.free')}
                    </Badge>
                  </div>
                </div>

                {!isPaidPlan && (
                  <p className="text-sm text-muted-foreground">
                    {t('profile:subscription.upgradePrompt')}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  {isPaidPlan ? (
                    <Button onClick={() => openPortal()} disabled={isPortalLoading}>
                      {isPortalLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Settings className="mr-2 h-4 w-4" />
                      )}
                      {t('profile:subscription.manage')}
                    </Button>
                  ) : (
                    <Button onClick={() => navigate('/pricing')}>
                      {t('profile:subscription.upgrade')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
