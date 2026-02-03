import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Heart,
  Users,
  Calendar,
  UserCheck,
  Send,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Globe,
  Play,
  Sparkles,
  Quote,
  ChevronLeft,
  ChevronRight,
  Star,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { SEO } from '@/shared/components/seo';

// Floating decorative elements for the hero
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating hearts */}
      <div className="absolute top-[15%] left-[10%] animate-float-slow opacity-35">
        <Heart className="h-8 w-8 text-primary fill-primary" />
      </div>
      <div className="absolute top-[25%] right-[15%] animate-float-medium opacity-30">
        <Heart className="h-6 w-6 text-primary fill-primary" />
      </div>
      <div className="absolute bottom-[30%] left-[20%] animate-float-fast opacity-20">
        <Heart className="h-10 w-10 text-primary fill-primary" />
      </div>
      <div className="absolute top-[60%] right-[8%] animate-float-slow opacity-35">
        <Heart className="h-5 w-5 text-primary fill-primary" />
      </div>

      {/* Sparkles */}
      <div className="absolute top-[20%] left-[30%] animate-pulse-slow opacity-45">
        <Sparkles className="h-4 w-4 text-amber-400" />
      </div>
      <div className="absolute top-[40%] right-[25%] animate-pulse-medium opacity-40">
        <Sparkles className="h-5 w-5 text-amber-400" />
      </div>
      <div className="absolute bottom-[25%] right-[30%] animate-pulse-fast opacity-30">
        <Sparkles className="h-3 w-3 text-amber-400" />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-[35%] left-[5%] animate-spin-very-slow opacity-10">
        <div className="w-16 h-16 rounded-full border-2 border-primary" />
      </div>
      <div className="absolute bottom-[15%] right-[10%] animate-spin-very-slow-reverse opacity-10">
        <div className="w-12 h-12 rounded-full border-2 border-primary" />
      </div>
    </div>
  );
}

// Demo preview mockup component
function DemoPreview() {
  const { t } = useTranslation(['landing']);
  const navigate = useNavigate();

  return (
    <div className="relative group cursor-pointer" onClick={() => navigate('/demo')}>
      {/* Browser chrome mockup */}
      <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border/50 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl">
        {/* Browser bar */}
        <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-background/80 rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
              amare.wedding/demo
            </div>
          </div>
        </div>

        {/* App preview */}
        <div className="bg-background p-6">
          {/* Mini dashboard mockup */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary fill-primary" />
                <span className="font-script text-lg text-primary">Amare</span>
                <Badge variant="secondary" className="text-xs">Demo</Badge>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { labelKey: 'demoPreview.guests', value: '124', color: 'text-foreground' },
                { labelKey: 'demoPreview.attending', value: '89', color: 'text-green-600' },
                { labelKey: 'demoPreview.pending', value: '28', color: 'text-amber-600' },
                { labelKey: 'demoPreview.events', value: '5', color: 'text-primary' },
              ].map((stat) => (
                <div key={stat.labelKey} className="bg-muted/30 rounded-lg p-3 text-center">
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{t(`landing:${stat.labelKey}`)}</div>
                </div>
              ))}
            </div>

            {/* Mini cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/20 rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {t('landing:demoPreview.upcoming')}
                </div>
                <div className="space-y-1.5">
                  <div className="bg-background rounded px-2 py-1.5 text-xs">
                    <div className="font-medium">{t('landing:demoPreview.ceremony')}</div>
                    <div className="text-muted-foreground">{t('landing:demoPreview.ceremonyTime')}</div>
                  </div>
                  <div className="bg-background rounded px-2 py-1.5 text-xs">
                    <div className="font-medium">{t('landing:demoPreview.reception')}</div>
                    <div className="text-muted-foreground">{t('landing:demoPreview.receptionTime')}</div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/20 rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium flex items-center gap-1.5">
                  <Wallet className="h-3 w-3" />
                  {t('landing:demoPreview.budget')}
                </div>
                <div className="text-lg font-bold">€12,450</div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-primary rounded-full" />
                </div>
                <div className="text-xs text-muted-foreground">{t('landing:demoPreview.budgetProgress')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
          <Play className="h-6 w-6 text-primary-foreground ml-1" fill="currentColor" />
        </div>
      </div>

      {/* Label */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Badge className="shadow-lg">{t('landing:hero.cta.viewDemo')}</Badge>
      </div>
    </div>
  );
}

// Testimonial keys for translation
const testimonialKeys = ['testimonial1', 'testimonial2', 'testimonial3'] as const;

// Testimonial carousel
function TestimonialCarousel() {
  const { t } = useTranslation(['landing']);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonialKeys.length);
    }, 8000);
  }, [stopAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    startAutoPlay();
  }, [startAutoPlay]);

  const prev = () => goTo((current - 1 + testimonialKeys.length) % testimonialKeys.length);
  const next = () => goTo((current + 1) % testimonialKeys.length);

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonialKeys.map((key, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="text-center space-y-6">
                <Quote className="h-10 w-10 mx-auto text-primary/30" />
                <p className="text-xl md:text-2xl font-serif italic text-foreground/90 leading-relaxed">
                  "{t(`landing:testimonials.${key}.quote`)}"
                </p>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold">{t(`landing:testimonials.${key}.author`)}</p>
                  <p className="text-sm text-muted-foreground">{t(`landing:testimonials.${key}.location`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          className="p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {testimonialKeys.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                index === current ? 'bg-primary w-6' : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Feature card with asymmetric design
function FeatureCard({
  icon: Icon,
  title,
  description,
  accent = false
}: {
  icon: typeof Globe;
  title: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <div className={`group relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
      accent
        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
        : 'bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg'
    }`}>
      <div className={`inline-flex p-3 rounded-xl mb-4 ${
        accent ? 'bg-white/20' : 'bg-primary/10'
      }`}>
        <Icon className={`h-6 w-6 ${accent ? 'text-primary-foreground' : 'text-primary'}`} />
      </div>
      <h3 className={`font-serif text-xl font-semibold mb-2 ${accent ? '' : 'text-foreground'}`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${accent ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
        {description}
      </p>
    </div>
  );
}

export function HomePage() {
  const { t } = useTranslation(['landing', 'common', 'auth']);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Globe,
      titleKey: 'landing:features.websiteBuilder.title',
      descriptionKey: 'landing:features.websiteBuilder.description',
      accent: true,
    },
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
      number: '01',
      titleKey: 'landing:howItWorks.step1.title',
      descriptionKey: 'landing:howItWorks.step1.description',
    },
    {
      number: '02',
      titleKey: 'landing:howItWorks.step2.title',
      descriptionKey: 'landing:howItWorks.step2.description',
    },
    {
      number: '03',
      titleKey: 'landing:howItWorks.step3.title',
      descriptionKey: 'landing:howItWorks.step3.description',
    },
  ];

  return (
    <>
      <SEO page="home" />
      <div className="min-h-screen bg-background">
        {/* Animated background gradient */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Header */}
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
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  {t('landing:nav.demo')}
                </Link>
                <Link
                  to="/pricing"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  {t('landing:nav.pricing')}
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden sm:inline-flex focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                {t('auth:login.title')}
              </Button>
              <Button size="sm" onClick={() => navigate('/register')} className="hidden sm:inline-flex shadow-lg shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                {t('auth:register.title')}
              </Button>

              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label="Open menu">
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
                      <Link
                        to="/demo"
                        className="text-base font-medium text-foreground hover:text-primary transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                      >
                        {t('landing:nav.demo')}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/pricing"
                        className="text-base font-medium text-foreground hover:text-primary transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                      >
                        {t('landing:nav.pricing')}
                      </Link>
                    </SheetClose>
                    <hr className="my-2" />
                    <div className="flex items-center gap-2 py-2">
                      <ThemeSwitcher />
                      <LanguageSwitcher />
                    </div>
                    <hr className="my-2" />
                    <SheetClose asChild>
                      <Button variant="ghost" onClick={() => navigate('/login')} className="justify-start focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                        {t('auth:login.title')}
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button onClick={() => navigate('/register')} className="shadow-lg shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                        {t('auth:register.title')}
                      </Button>
                    </SheetClose>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
          <FloatingElements />

          <div className="container mx-auto px-4 py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left side - Text content */}
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <Badge variant="secondary" className="animate-fade-in">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {t('landing:hero.badge', 'The #1 Wedding Planning Platform')}
                  </Badge>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-[1.1] animate-fade-in-up">
                    {t('landing:hero.headline')}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
                    {t('landing:hero.subheadline')}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
                  <Button
                    size="lg"
                    onClick={() => navigate('/register')}
                    className="text-base px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {t('landing:hero.cta.getStarted')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/demo')}
                    className="text-base px-8 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    {t('landing:hero.cta.viewDemo')}
                  </Button>
                </div>

                {/* Social proof mini */}
                <div className="flex items-center gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-600">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center"
                      >
                        <Heart className="h-3 w-3 text-primary" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{t('landing:hero.socialProofCount')}</span> {t('landing:hero.socialProof')}
                  </p>
                </div>
              </div>

              {/* Right side - Demo preview */}
              <div className="animate-fade-in-up animation-delay-300 lg:animate-fade-in-left">
                <DemoPreview />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
              <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-scroll-indicator" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4 space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold">
                {t('landing:features.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('landing:features.subtitle')}
              </p>
            </div>

            {/* Asymmetric grid */}
            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.titleKey}
                  className={index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={t(feature.titleKey)}
                    description={t(feature.descriptionKey)}
                    accent={feature.accent}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4 space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold">
                {t('landing:howItWorks.title')}
              </h2>
              <p className="text-lg text-muted-foreground">{t('landing:howItWorks.subtitle')}</p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              {/* Connector line - spans across all steps on desktop */}
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-[2px] bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

              <div className="grid gap-8 md:grid-cols-3">
                {steps.map((step) => (
                  <div key={step.number} className="relative text-center">
                    <div className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-serif font-bold shadow-lg shadow-primary/25">
                      {step.number}
                    </div>
                    <div className="mt-4 space-y-2">
                      <h3 className="font-serif text-xl font-semibold">{t(step.titleKey)}</h3>
                      <p className="text-muted-foreground text-sm max-w-xs mx-auto">{t(step.descriptionKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 space-y-12">
            <div className="text-center space-y-4">
              <Badge variant="secondary">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                {t('landing:testimonials.badge', 'Love Stories')}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold">
                {t('landing:testimonials.title', 'What Couples Say')}
              </h2>
            </div>
            <TestimonialCarousel />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 text-center space-y-8 relative">
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold">
                {t('landing:pricingCta.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('landing:pricingCta.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="text-base px-8 shadow-lg shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t('landing:hero.cta.getStarted')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="text-base px-8 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t('landing:pricingCta.cta')}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">{t('landing:trust.free', 'Free to start')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">{t('landing:trust.noCard', 'No credit card required')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">{t('landing:trust.cancel', 'Cancel anytime')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary fill-primary" />
                <span className="text-xl font-script text-primary">{t('common:appName')}</span>
              </div>
              <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <Link to="/demo" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
                  {t('landing:nav.demo')}
                </Link>
                <Link to="/pricing" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
                  {t('landing:nav.pricing')}
                </Link>
                <Link to="/login" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
                  {t('auth:login.title')}
                </Link>
                <Link to="/register" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
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
