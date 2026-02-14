import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Users, UserCheck, TrendingUp, Coins, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useReferralCode, useReferralStats, useReferrals } from '../hooks/useReferrals';

const COMMISSION_STATUS_LABELS: Record<number, string> = {
  0: 'pending',
  1: 'paid',
  2: 'expired',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function ReferralDashboard() {
  const { t } = useTranslation(['referrals', 'common']);
  const { code, isLoading: isCodeLoading } = useReferralCode();
  const { stats, isLoading: isStatsLoading } = useReferralStats();
  const { referrals, isLoading: isReferralsLoading } = useReferrals();
  const [copied, setCopied] = useState(false);

  const referralUrl = code ? `${window.location.origin}/ref/${code}` : '';

  const handleCopy = async () => {
    if (!referralUrl) return;
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('referrals:link.title')}
          </CardTitle>
          <CardDescription>{t('referrals:link.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isCodeLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm font-mono truncate">
                {referralUrl}
              </div>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="h-4 w-4" />
              {t('referrals:stats.signedUp')}
            </div>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <div className="text-2xl font-bold mt-1">{stats?.signedUpCount ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <UserCheck className="h-4 w-4" />
              {t('referrals:stats.subscribed')}
            </div>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <div className="text-2xl font-bold mt-1">{stats?.subscribedCount ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <TrendingUp className="h-4 w-4" />
              {t('referrals:stats.conversionRate')}
            </div>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <div className="text-2xl font-bold mt-1">{stats?.conversionRate ?? 0}%</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Coins className="h-4 w-4" />
              {t('referrals:stats.earned')}
            </div>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <div className="text-2xl font-bold mt-1">
                {formatCurrency(stats?.totalCommissionEarned ?? 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Payout */}
      {stats && (stats.pendingPayout ?? 0) > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
          <CardContent className="flex items-center gap-3 pt-6">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium">{t('referrals:stats.pendingPayout')}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(stats.pendingPayout ?? 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>{t('referrals:activity.title')}</CardTitle>
          <CardDescription>{t('referrals:activity.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isReferralsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : referrals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t('referrals:activity.empty')}
            </p>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {referral.referredUserName ?? t('referrals:activity.anonymous')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {referral.registeredAt
                        ? new Date(referral.registeredAt).toLocaleDateString()
                        : t('referrals:activity.notRegistered')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {referral.convertedAt && (
                      <Badge variant="secondary" className="text-xs">
                        {t('referrals:activity.converted')}
                      </Badge>
                    )}
                    <Badge
                      variant={
                        COMMISSION_STATUS_LABELS[referral.commissionStatus ?? 0] === 'paid'
                          ? 'default'
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {t(`referrals:status.${COMMISSION_STATUS_LABELS[referral.commissionStatus ?? 0] ?? 'pending'}`)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
