import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, X, Sparkles, Loader2, Heart, Menu, ArrowRight, Shield } from 'lucide-react';
import { useAuth, useCurrentUser } from '@/features/auth/hooks/useAuth';
import {
  usePlans,
  useCheckout,
  tierToString,
} from '@/features/billing';
import type { SubscriptionTier, BillingPlanDto } from '@/features/billing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { FontSizeSwitcher } from '@/shared/components/FontSizeSwitcher';
import { SEO } from '@/shared/components/seo';

export function PricingPage() {
  const { t } = useTranslation(['billing', 'common', 'auth', 'landing']);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { plans, isLoading: isLoadingPlans } = usePlans();
  const { startCheckout, isLoading: isCheckoutLoading } = useCheckout();
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Ensure current user data is loaded for subscription tier
  useCurrentUser({ enabled: isAuthenticated });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get current subscription tier (default to Free if not set)
  const currentTier: SubscriptionTier = user?.subscriptionTier ?? 0;

  const getPrice = (plan: BillingPlanDto): number | null => {
    if (plan.tier === 0) return 0;
    // Get the one-time (lifetime) price
    const price = plan.prices?.find((p) => p.interval === 0);
    if (!price?.unitAmount) return null;
    // unitAmount is in cents, convert to euros
    return price.unitAmount / 100;
  };

  const hasPrice = (plan: BillingPlanDto): boolean => {
    if (plan.tier === 0) return true;
    return plan.prices?.some((p) => p.interval === 0) ?? false;
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

    // Use Stripe Checkout for one-time payment
    setLoadingTier(tier);
    startCheckout(
      { tier, interval: 0 }, // interval 0 = Lifetime (one-time)
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
      <div className="min-h-screen bg-background">
        {/* Animated background gradient */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Header - matching home page */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm' : ''
        }`}>
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <Heart className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/demo"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('landing:nav.demo')}
                </Link>
                <Link
                  to="/pricing"
                  className="text-sm font-medium text-primary transition-colors"
                >
                  {t('landing:nav.pricing')}
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <FontSizeSwitcher />
                <LanguageSwitcher />
              </div>
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                  {t('billing:backToDashboard')}
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden sm:inline-flex">
                    {t('auth:login.title')}
                  </Button>
                  <Button size="sm" onClick={() => navigate('/register')} className="hidden sm:inline-flex shadow-lg shadow-primary/25">
                    {t('auth:register.title')}
                  </Button>
                </>
              )}

              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary fill-primary" />
                      <span className="font-script text-primary">{t('common:appName')}</span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-8">
                    <SheetClose asChild>
                      <Link to="/demo" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2">
                        {t('landing:nav.demo')}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/pricing" className="text-base font-medium text-primary transition-colors py-2">
                        {t('landing:nav.pricing')}
                      </Link>
                    </SheetClose>
                    <hr className="my-2" />
                    <div className="flex items-center gap-2 py-2">
                      <FontSizeSwitcher />
                      <LanguageSwitcher />
                    </div>
                    <hr className="my-2" />
                    {isAuthenticated ? (
                      <SheetClose asChild>
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>
                          {t('billing:backToDashboard')}
                        </Button>
                      </SheetClose>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Button variant="ghost" onClick={() => navigate('/login')} className="justify-start">
                            {t('auth:login.title')}
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button onClick={() => navigate('/register')} className="shadow-lg shadow-primary/25">
                            {t('auth:register.title')}
                          </Button>
                        </SheetClose>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main className="relative pt-24 pb-16">
          <div className="container mx-auto px-4 space-y-12">
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold">
                {t('billing:title')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('billing:subtitle')}
              </p>
              {/* One-time payment badge */}
              <Badge variant="secondary" className="text-sm gap-1">
                <Shield className="h-3 w-3" />
                {t('billing:oneTimePayment')}
              </Badge>
            </div>

            {/* Loading State */}
            {isLoadingPlans && (
              <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative rounded-2xl border bg-card p-6">
                    <div className="text-center pb-2">
                      <Skeleton className="h-6 w-24 mx-auto mb-2" />
                      <Skeleton className="h-4 w-40 mx-auto" />
                    </div>
                    <div className="space-y-6 pt-4">
                      <Skeleton className="h-12 w-24 mx-auto" />
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((j) => (
                          <Skeleton key={j} className="h-4 w-full" />
                        ))}
                      </div>
                      <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pricing Cards */}
            {!isLoadingPlans && (
              <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                {plans.map((plan) => {
                  const tier = plan.tier ?? 0;
                  const isCurrentPlan = isAuthenticated && tier === currentTier;
                  const isButtonLoading = isCheckoutLoading && loadingTier === tier;
                  const isHighlighted = tier === highlightedTier;
                  const price = getPrice(plan);
                  const hasPriceForPlan = hasPrice(plan);
                  const tierName = tierToString(tier).toLowerCase();

                  return (
                    <div
                      key={tier}
                      className={`relative flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg ${
                        isCurrentPlan
                          ? 'border-2 border-green-500 shadow-lg shadow-green-500/10'
                          : isHighlighted
                          ? 'border-2 border-primary shadow-xl shadow-primary/10 scale-[1.02]'
                          : 'hover:border-primary/30'
                      }`}
                    >
                      {/* Badge */}
                      {isCurrentPlan && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-green-500 hover:bg-green-500 text-white border-0">
                            {t('billing:currentPlan')}
                          </Badge>
                        </div>
                      )}
                      {!isCurrentPlan && isHighlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="gap-1 shadow-lg">
                            <Sparkles className="h-3 w-3" />
                            {t('billing:popular')}
                          </Badge>
                        </div>
                      )}

                      {/* Plan Header */}
                      <div className="text-center pb-4">
                        <h3 className="text-xl font-semibold">
                          {plan.name || t(`billing:plans.${tierName}.name`)}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t(`billing:plans.${tierName}.description`)}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-center py-4 border-y border-border/50">
                        {tier === 0 ? (
                          <span className="text-4xl font-bold">{t('billing:free')}</span>
                        ) : hasPriceForPlan ? (
                          <div>
                            <span className="text-4xl font-bold">€{price}</span>
                            <span className="text-muted-foreground ml-1 text-sm">
                              {t('billing:oneTime')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg text-muted-foreground">
                            {t('billing:notAvailable')}
                          </span>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex-grow py-6">
                        {(() => {
                          const includedFeatures = (plan.features ?? []).filter(
                            (f) => !['guests', 'events', 'emails'].includes(f)
                          );
                          const notIncludedFeatures = (plan.notIncludedFeatures ?? []).filter(
                            (f) => !['guests', 'events', 'emails'].includes(f)
                          );

                          return (
                            <div className="space-y-3 text-sm">
                              {/* Limits */}
                              <div className="flex items-center gap-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                  <Check className="h-3 w-3 text-green-600" />
                                </div>
                                <span>{formatLimit(plan.maxGuests, 'guests')}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                  <Check className="h-3 w-3 text-green-600" />
                                </div>
                                <span>{formatLimit(plan.maxEvents, 'events')}</span>
                              </div>
                              {plan.maxEmailsPerMonth !== undefined && plan.maxEmailsPerMonth !== 0 && (
                                <div className="flex items-center gap-3">
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                    <Check className="h-3 w-3 text-green-600" />
                                  </div>
                                  <span>{formatLimit(plan.maxEmailsPerMonth, 'emails')}</span>
                                </div>
                              )}

                              {/* Included Features */}
                              {includedFeatures.map((featureKey) => (
                                <div key={featureKey} className="flex items-center gap-3">
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                    <Check className="h-3 w-3 text-green-600" />
                                  </div>
                                  <span>{t(`billing:features.${featureKey}`)}</span>
                                </div>
                              ))}

                              {/* Not Included Features */}
                              {notIncludedFeatures.length > 0 && (
                                <>
                                  <p className="text-xs text-muted-foreground font-medium pt-3 pb-1">
                                    {t('billing:notIncluded')}
                                  </p>
                                  {notIncludedFeatures.map((featureKey) => (
                                    <div key={featureKey} className="flex items-center gap-3 text-muted-foreground">
                                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                                        <X className="h-3 w-3" />
                                      </div>
                                      <span>{t(`billing:features.${featureKey}`)}</span>
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
                        className={`w-full mt-auto rounded-xl h-11 ${
                          isHighlighted && !isCurrentPlan ? 'shadow-lg shadow-primary/25' : ''
                        }`}
                        variant={
                          isCurrentPlan ? 'secondary' : isHighlighted ? 'default' : 'outline'
                        }
                        disabled={isCurrentPlan || isButtonLoading || (!hasPriceForPlan && tier !== 0)}
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
                          <>
                            {t('billing:getStartedFree')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        ) : !hasPriceForPlan ? (
                          t('billing:notAvailable')
                        ) : (
                          <>
                            {t('billing:buyNow')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Money-back guarantee */}
            <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
              <p>{t('billing:moneyBackGuarantee')}</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t py-12 bg-card/50 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary fill-primary" />
                <span className="text-xl font-script text-primary">{t('common:appName')}</span>
              </div>
              <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <Link to="/demo" className="hover:text-foreground transition-colors">
                  {t('landing:nav.demo')}
                </Link>
                <Link to="/pricing" className="hover:text-foreground transition-colors">
                  {t('landing:nav.pricing')}
                </Link>
                <Link to="/login" className="hover:text-foreground transition-colors">
                  {t('auth:login.title')}
                </Link>
                <Link to="/register" className="hover:text-foreground transition-colors">
                  {t('auth:register.title')}
                </Link>
              </nav>
              <p className="text-sm text-muted-foreground">
                {t('landing:footer.copyright', { year: new Date().getFullYear() })}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
