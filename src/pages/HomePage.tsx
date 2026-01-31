import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Users,
  Calendar,
  UserCheck,
  Send,
  Plus,
  CheckCircle2,
  ArrowRight,
  BookHeart,
  LayoutGrid,
  Contact,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { SEO } from '@/shared/components/seo';

export function HomePage() {
  const { t } = useTranslation(['landing', 'common', 'auth']);
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      titleKey: 'landing:features.guestManagement.title',
      descriptionKey: 'landing:features.guestManagement.description',
    },
    {
      icon: Calendar,
      titleKey: 'landing:features.eventPlanning.title',
      descriptionKey: 'landing:features.eventPlanning.description',
    },
    {
      icon: UserCheck,
      titleKey: 'landing:features.rsvpTracking.title',
      descriptionKey: 'landing:features.rsvpTracking.description',
    },
    {
      icon: Send,
      titleKey: 'landing:features.invitations.title',
      descriptionKey: 'landing:features.invitations.description',
    },
    {
      icon: Wallet,
      titleKey: 'landing:features.budgetManagement.title',
      descriptionKey: 'landing:features.budgetManagement.description',
    },
  ];

  const steps = [
    {
      number: 1,
      icon: Plus,
      titleKey: 'landing:howItWorks.step1.title',
      descriptionKey: 'landing:howItWorks.step1.description',
    },
    {
      number: 2,
      icon: Users,
      titleKey: 'landing:howItWorks.step2.title',
      descriptionKey: 'landing:howItWorks.step2.description',
    },
    {
      number: 3,
      icon: CheckCircle2,
      titleKey: 'landing:howItWorks.step3.title',
      descriptionKey: 'landing:howItWorks.step3.description',
    },
  ];

  const comingSoonFeatures = [
    {
      icon: BookHeart,
      titleKey: 'landing:comingSoon.guestbook.title',
      descriptionKey: 'landing:comingSoon.guestbook.description',
    },
    {
      icon: LayoutGrid,
      titleKey: 'landing:comingSoon.seating.title',
      descriptionKey: 'landing:comingSoon.seating.description',
    },
    {
      icon: Contact,
      titleKey: 'landing:comingSoon.vendors.title',
      descriptionKey: 'landing:comingSoon.vendors.description',
    },
  ];

  return (
    <>
      <SEO page="home" />
      <div className="min-h-screen bg-background">
        {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/demo"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('landing:nav.demo')}
              </Link>
              <Link
                to="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('landing:nav.pricing')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Button variant="ghost" onClick={() => navigate('/login')}>
              {t('auth:login.title')}
            </Button>
            <Button onClick={() => navigate('/register')}>{t('auth:register.title')}</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-script text-primary">
              {t('landing:hero.headline')}
            </h1>
            <p className="text-xl text-muted-foreground">{t('landing:hero.subheadline')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')}>
              {t('landing:hero.cta.getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/demo')}>
              {t('landing:hero.cta.viewDemo')}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
              {t('landing:hero.cta.viewPricing')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t('landing:features.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('landing:features.subtitle')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.titleKey}>
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{t(feature.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t(feature.descriptionKey)}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t('landing:howItWorks.title')}</h2>
            <p className="text-muted-foreground">{t('landing:howItWorks.subtitle')}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
                <step.icon className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="font-semibold text-lg">{t(step.titleKey)}</h3>
                <p className="text-muted-foreground text-sm">{t(step.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="mb-2">
              {t('landing:comingSoon.badge')}
            </Badge>
            <h2 className="text-3xl font-bold">{t('landing:comingSoon.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('landing:comingSoon.subtitle')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {comingSoonFeatures.map((feature) => (
              <Card key={feature.titleKey} className="border-dashed">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary/60 mb-2" />
                  <CardTitle className="text-lg">{t(feature.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t(feature.descriptionKey)}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">{t('landing:pricingCta.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('landing:pricingCta.description')}
          </p>
          <Button size="lg" onClick={() => navigate('/pricing')}>
            {t('landing:pricingCta.cta')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-xl font-script text-primary">{t('common:appName')}</span>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
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
