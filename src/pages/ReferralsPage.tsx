import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuth, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { ReferralDashboard } from '@/features/referrals/components/ReferralDashboard';
import { PlannerLayout } from '@/layouts/PlannerLayout';

export function ReferralsPage() {
  const { t } = useTranslation(['referrals']);
  const { user } = useAuth();
  useCurrentUser();

  if (user?.accountType !== 1) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PlannerLayout>
      <main className="container mx-auto p-4 py-8 max-w-4xl space-y-6">
        <div>
          <h2 className="text-3xl font-bold">{t('referrals:title')}</h2>
          <p className="text-muted-foreground">{t('referrals:subtitle')}</p>
        </div>

        <ReferralDashboard />
      </main>
    </PlannerLayout>
  );
}
