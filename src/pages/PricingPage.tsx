import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Check, X, Sparkles, Loader2 } from 'lucide-react';
import { useAuth, useCurrentUser } from '@/features/auth/hooks/useAuth';
import {
  usePlans,
  useCheckout,
  usePortalSession,
  intervalToEnum,
  tierToString,
} from '@/features/billing';
import type { SubscriptionTier, BillingPlanDto, BillingInterval } from '@/features/billing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { SEO } from '@/shared/components/seo';

type BillingCycle = 'Monthly' | 'Annual' | 'Lifetime';

export function PricingPage() {
  const { t } = useTranslation(['billing', 'common', 'auth']);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { plans, isLoading: isLoadingPlans } = usePlans();
  const { startCheckout, isLoading: isCheckoutLoading } = useCheckout();
  const { openPortal, isLoading: isPortalLoading } = usePortalSession();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Monthly');
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null);

  // Ensure current user data is loaded for subscription tier
  useCurrentUser({ enabled: isAuthenticated });

  // Get current subscription tier (default to Free if not set)
  const currentTier: SubscriptionTier = user?.subscriptionTier ?? 0;

  // Check which billing cycles are available across all plans
  const availableCycles = useMemo(() => {
    const cycles = new Set<BillingCycle>();
    plans.forEach((plan) => {
      plan.prices?.forEach((price) => {
        if (price.interval === 0) cycles.add('Monthly');
        if (price.interval === 1) cycles.add('Annual');
        if (price.interval === 2) cycles.add('Lifetime');
      });
    });
    return cycles;
  }, [plans]);

  // Calculate savings percentage for annual vs monthly
  const annualSavingsPercent = useMemo(() => {
    const starterPlan = plans.find((p) => p.tier === 1);
    if (!starterPlan?.prices) return 0;
    const monthlyPrice = starterPlan.prices.find((p) => p.interval === 0)?.unitAmount ?? 0;
    const annualPrice = starterPlan.prices.find((p) => p.interval === 1)?.unitAmount ?? 0;
    if (monthlyPrice === 0 || annualPrice === 0) return 0;
    const yearlyFromMonthly = monthlyPrice * 12;
    return Math.round(((yearlyFromMonthly - annualPrice) / yearlyFromMonthly) * 100);
  }, [plans]);

  const getPrice = (plan: BillingPlanDto): number | null => {
    if (plan.tier === 0) return 0;
    const intervalEnum = intervalToEnum(billingCycle);
    const price = plan.prices?.find((p) => p.interval === intervalEnum);
    if (!price?.unitAmount) return null;
    // unitAmount is in cents, convert to euros
    return price.unitAmount / 100;
  };

  const hasPrice = (plan: BillingPlanDto): boolean => {
    if (plan.tier === 0) return true;
    const intervalEnum = intervalToEnum(billingCycle);
    return plan.prices?.some((p) => p.interval === intervalEnum) ?? false;
  };

  const handleSelectPlan = (plan: BillingPlanDto) => {
    const tier = plan.tier ?? 0;

    // Can't select current plan
    if (isAuthenticated && tier === currentTier) {
      return;
    }

    if (tier === 0) {
      // Free plan - just go to dashboard or register
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/register');
      }
      return;
    }

    if (!isAuthenticated) {
      // Redirect to register first, then they can upgrade
      navigate('/register', {
        state: { returnTo: '/pricing', selectedPlan: tierToString(tier) },
      });
      return;
    }

    // Existing subscribers use Billing Portal for upgrades/downgrades
    if (currentTier > 0) {
      setLoadingTier(tier);
      openPortal(undefined, {
        onSettled: () => setLoadingTier(null),
      });
      return;
    }

    // New subscribers use Stripe Checkout
    const interval: BillingInterval = intervalToEnum(billingCycle);
    setLoadingTier(tier);
    startCheckout(
      { tier, interval },
      {
        onSettled: () => setLoadingTier(null),
      }
    );
  };

  const formatLimit = (value: number | undefined, type: 'guests' | 'events' | 'emails'): string => {
    if (value === undefined || value === -1 || value >= 999999) {
      return t(`billing:limits.unlimited${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
    return t(`billing:limits.${type}`, { count: value });
  };

  // Determine which plan to highlight (Starter by default)
  const highlightedTier = 1;

  return (
    <>
      <SEO page="pricing" />
      <div className="min-h-screen bg-gradient-to-b from-rose-50/30 to-background">
        <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate('/')}
          >
            {t('common:appName')}
          </h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                {t('billing:backToDashboard')}
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  {t('auth:login.title')}
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  {t('auth:register.title')}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">{t('billing:title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('billing:subtitle')}
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {availableCycles.has('Monthly') && (
            <Button
              variant={billingCycle === 'Monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBillingCycle('Monthly')}
            >
              {t('billing:monthly')}
            </Button>
          )}
          {availableCycles.has('Annual') && (
            <Button
              variant={billingCycle === 'Annual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBillingCycle('Annual')}
            >
              {t('billing:annual')}
              {annualSavingsPercent > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {t('billing:savePercent', { percent: annualSavingsPercent })}
                </Badge>
              )}
            </Button>
          )}
          {availableCycles.has('Lifetime') && (
            <Button
              variant={billingCycle === 'Lifetime' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBillingCycle('Lifetime')}
            >
              {t('billing:lifetime')}
              <Badge variant="secondary" className="ml-2">
                {t('billing:oneTime')}
              </Badge>
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoadingPlans && (
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="relative">
                <CardHeader className="text-center pb-2">
                  <Skeleton className="h-6 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <Skeleton className="h-10 w-20 mx-auto" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pricing Cards */}
        {!isLoadingPlans && (
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const tier = plan.tier ?? 0;
              const isCurrentPlan = isAuthenticated && tier === currentTier;
              const isButtonLoading = (isCheckoutLoading || isPortalLoading) && loadingTier === tier;
              const isHighlighted = tier === highlightedTier;
              const price = getPrice(plan);
              const hasPriceForCycle = hasPrice(plan);
              const tierName = tierToString(tier).toLowerCase();

              return (
                <Card
                  key={tier}
                  className={`relative flex flex-col ${
                    isCurrentPlan
                      ? 'border-2 border-green-600 shadow-lg'
                      : isHighlighted
                      ? 'border-2 border-primary shadow-lg'
                      : ''
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {t('billing:currentPlan')}
                      </Badge>
                    </div>
                  )}
                  {!isCurrentPlan && isHighlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        {t('billing:popular')}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">
                      {plan.name || t(`billing:plans.${tierName}.name`)}
                    </CardTitle>
                    <CardDescription>
                      {t(`billing:plans.${tierName}.description`)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow space-y-6">
                    {/* Price */}
                    <div className="text-center">
                      {tier === 0 ? (
                        <span className="text-4xl font-bold">{t('billing:free')}</span>
                      ) : hasPriceForCycle ? (
                        <>
                          <span className="text-4xl font-bold">€{price}</span>
                          <span className="text-muted-foreground">
                            {billingCycle === 'Monthly'
                              ? t('billing:perMonth')
                              : billingCycle === 'Annual'
                              ? t('billing:perYear')
                              : ''}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg text-muted-foreground">
                          {t('billing:notAvailable')}
                        </span>
                      )}
                    </div>

                    {/* All Features */}
                    <div className="flex-grow">
                      {(() => {
                        const includedFeatures = (plan.features ?? []).filter(
                          (f) => !['guests', 'events', 'emails'].includes(f)
                        );
                        const notIncludedFeatures = (plan.notIncludedFeatures ?? []).filter(
                          (f) => !['guests', 'events', 'emails'].includes(f)
                        );

                        return (
                          <div className="space-y-2 text-sm">
                            {/* Limits */}
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              {formatLimit(plan.maxGuests, 'guests')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              {formatLimit(plan.maxEvents, 'events')}
                            </div>
                            {plan.maxEmailsPerMonth !== undefined && plan.maxEmailsPerMonth !== 0 && (
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                {formatLimit(plan.maxEmailsPerMonth, 'emails')}
                              </div>
                            )}

                            {/* Included Features */}
                            {includedFeatures.map((featureKey) => (
                              <div key={featureKey} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                {t(`billing:features.${featureKey}`)}
                              </div>
                            ))}

                            {/* Not Included Features */}
                            {notIncludedFeatures.length > 0 && (
                              <>
                                <p className="text-xs text-muted-foreground font-medium pt-2">
                                  {t('billing:notIncluded')}
                                </p>
                                {notIncludedFeatures.map((featureKey) => (
                                  <div key={featureKey} className="flex items-center gap-2 text-muted-foreground">
                                    <X className="h-4 w-4" />
                                    {t(`billing:features.${featureKey}`)}
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full mt-auto"
                      variant={
                        isCurrentPlan ? 'secondary' : isHighlighted ? 'default' : 'outline'
                      }
                      disabled={isCurrentPlan || isButtonLoading || (!hasPriceForCycle && tier !== 0)}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {isButtonLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common:loading')}
                        </>
                      ) : isCurrentPlan ? (
                        t('billing:currentPlan')
                      ) : tier === 0 ? (
                        t('billing:getStartedFree')
                      ) : !hasPriceForCycle ? (
                        t('billing:notAvailable')
                      ) : currentTier > 0 ? (
                        t('billing:changePlan.confirm')
                      ) : (
                        t('billing:subscribe')
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* FAQ or additional info */}
        <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          <p>{t('billing:cancelAnytime')}</p>
        </div>
        </main>
      </div>
    </>
  );
}
