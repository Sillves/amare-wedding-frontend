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
  Wallet,
  LayoutGrid,
  Contact,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

export function HomePage() {
  const { t } = useTranslation(['landing', 'common', 'auth']);
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: t('landing:features.guestManagement.title'),
      description: t('landing:features.guestManagement.description'),
    },
    {
      icon: Calendar,
      title: t('landing:features.eventPlanning.title'),
      description: t('landing:features.eventPlanning.description'),
    },
    {
      icon: UserCheck,
      title: t('landing:features.rsvpTracking.title'),
      description: t('landing:features.rsvpTracking.description'),
    },
    {
      icon: Send,
      title: t('landing:features.invitations.title'),
      description: t('landing:features.invitations.description'),
    },
  ];

  const steps = [
    {
      number: 1,
      icon: Plus,
      title: t('landing:howItWorks.step1.title'),
      description: t('landing:howItWorks.step1.description'),
    },
    {
      number: 2,
      icon: Users,
      title: t('landing:howItWorks.step2.title'),
      description: t('landing:howItWorks.step2.description'),
    },
    {
      number: 3,
      icon: CheckCircle2,
      title: t('landing:howItWorks.step3.title'),
      description: t('landing:howItWorks.step3.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">{t('common:appName')}</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('landing:nav.pricing')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="ghost" onClick={() => navigate('/login')}>
              {t('auth:login.title')}
            </Button>
            <Button onClick={() => navigate('/register')}>
              {t('auth:register.title')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-rose-50/50 to-background">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t('landing:hero.headline')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('landing:hero.subheadline')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')}>
              {t('landing:hero.cta.getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
              {t('landing:hero.cta.viewPricing')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-rose-50/30">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t('landing:features.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('landing:features.subtitle')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
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
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-gradient-to-b from-rose-50/20 to-background">
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            <Card className="border-dashed">
              <CardHeader>
                <BookHeart className="h-10 w-10 text-primary/60 mb-2" />
                <CardTitle className="text-lg">{t('landing:comingSoon.guestbook.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('landing:comingSoon.guestbook.description')}</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardHeader>
                <Wallet className="h-10 w-10 text-primary/60 mb-2" />
                <CardTitle className="text-lg">{t('landing:comingSoon.expenses.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('landing:comingSoon.expenses.description')}</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardHeader>
                <LayoutGrid className="h-10 w-10 text-primary/60 mb-2" />
                <CardTitle className="text-lg">{t('landing:comingSoon.seating.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('landing:comingSoon.seating.description')}</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardHeader>
                <Contact className="h-10 w-10 text-primary/60 mb-2" />
                <CardTitle className="text-lg">{t('landing:comingSoon.vendors.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('landing:comingSoon.vendors.description')}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50/40 to-background">
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
      <footer className="border-t py-12 bg-rose-50/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold">{t('common:appName')}</span>
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
  );
}
