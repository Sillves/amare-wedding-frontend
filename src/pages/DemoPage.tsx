import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  UserCheck,
  UserX,
  Clock,
  MapPin,
  ArrowRight,
  CalendarDays,
  Wallet,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays, isToday, parseISO } from 'date-fns';
import { DemoProvider, useDemoContext } from '@/features/demo/context/DemoContext';
import { DemoBanner } from '@/features/demo/components/DemoBanner';
import { getDemoData } from '@/features/demo/data';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { SEO } from '@/shared/components/seo';

function DemoDashboardContent() {
  const { t, i18n } = useTranslation(['common', 'weddings', 'guests', 'events', 'demo', 'expenses', 'website']);
  const navigate = useNavigate();
  const { guests, events, expenseSummary } = useDemoContext();

  // Get localized demo data
  const demoData = useMemo(() => getDemoData(i18n.language), [i18n.language]);
  const wedding = demoData.wedding;

  // Calculate wedding countdown
  const weddingCountdown = useMemo(() => {
    if (!wedding?.date) return null;

    const weddingDate = parseISO(wedding.date);
    const daysUntil = differenceInDays(weddingDate, new Date());

    if (isToday(weddingDate)) {
      return { type: 'today', text: t('common:dashboard.today') };
    } else if (daysUntil > 0) {
      return {
        type: 'future',
        days: daysUntil,
        text: t('common:dashboard.daysUntil', { count: daysUntil }),
      };
    } else {
      return {
        type: 'past',
        days: Math.abs(daysUntil),
        text: t('common:dashboard.past', { count: Math.abs(daysUntil) }),
      };
    }
  }, [wedding?.date, t]);

  // Calculate guest statistics
  const guestStats = useMemo(() => {
    if (!guests) return { total: 0, attending: 0, declined: 0, pending: 0, maybe: 0 };

    return {
      total: guests.length,
      attending: guests.filter((g) => g.rsvpStatus === 1).length,
      declined: guests.filter((g) => g.rsvpStatus === 2).length,
      pending: guests.filter((g) => g.rsvpStatus === 0).length,
      maybe: guests.filter((g) => g.rsvpStatus === 3).length,
    };
  }, [guests]);

  // Get upcoming events (next 3 events)
  const upcomingEvents = useMemo(() => {
    if (!events) return [];

    const now = new Date();
    return events
      .filter((event) => event.startDate && new Date(event.startDate) >= now)
      .sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
        const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3);
  }, [events]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-muted/40 overflow-x-hidden">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">{t('common:appName')}</span>
            <Badge variant="secondary" className="ml-2">
              Demo
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1 sm:gap-3">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            <Button variant="outline" size="sm" className="px-2 sm:px-4" onClick={() => navigate('/')}>
              {t('demo:exitDemo')}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto">
            <Button
              variant="ghost"
              className="rounded-none border-b-2 border-primary"
              onClick={() => navigate('/demo')}
            >
              {t('common:dashboard.title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/guests')}>
              {t('guests:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/events')}>
              {t('events:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/expenses')}>
              {t('expenses:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/website')}>
              {t('website:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/rsvp')}>
              RSVP
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 space-y-6">
        {/* Demo Banner */}
        <DemoBanner />

        {/* Welcome Header */}
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">
            {t('common:dashboard.welcome')}, {t('demo:demoUser')}!
          </h2>
          <p className="text-muted-foreground">{t('common:tagline')}</p>
        </div>

        {/* Wedding Overview Card */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">{wedding.title}</CardTitle>
                {weddingCountdown && (
                  <Badge
                    variant={
                      weddingCountdown.type === 'today'
                        ? 'default'
                        : weddingCountdown.type === 'future'
                          ? 'secondary'
                          : 'outline'
                    }
                    className="font-normal"
                  >
                    {weddingCountdown.text}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('weddings:details.date')}</p>
                  <p className="text-sm text-muted-foreground">
                    {wedding.date ? format(parseISO(wedding.date), 'PPP') : '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('weddings:details.location')}</p>
                  <p className="text-sm text-muted-foreground">{wedding.location || '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Statistics */}
        <div>
          <h3 className="text-lg font-semibold mb-3">{t('guests:title')}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate('/demo/guests')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:totalGuests')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guestStats.total}</div>
                <p className="text-xs text-muted-foreground">{t('guests:stats.allGuests')}</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate('/demo/guests')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:attending')}</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{guestStats.attending}</div>
                <p className="text-xs text-muted-foreground">
                  {guestStats.total > 0 ? Math.round((guestStats.attending / guestStats.total) * 100) : 0}%{' '}
                  {t('guests:stats.confirmed')}
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate('/demo/guests')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:pending')}</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{guestStats.pending}</div>
                <p className="text-xs text-muted-foreground">{t('guests:stats.pending')}</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate('/demo/guests')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:declined')}</CardTitle>
                <UserX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{guestStats.declined}</div>
                <p className="text-xs text-muted-foreground">
                  {guestStats.total > 0 ? Math.round((guestStats.declined / guestStats.total) * 100) : 0}%{' '}
                  {t('guests:stats.declined')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions & Upcoming Events */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                {t('expenses:summary.title')}
              </CardTitle>
              <CardDescription>{t('expenses:subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">{formatCurrency(expenseSummary.totalAmount ?? 0)}</div>
              <div className="space-y-2">
                {expenseSummary.categoryTotals &&
                  Object.entries(expenseSummary.categoryTotals)
                    .filter(([, value]) => value > 0)
                    .slice(0, 4)
                    .map(([category, amount]) => (
                      <div key={category} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{category}</span>
                        <span className="font-medium">{formatCurrency(amount)}</span>
                      </div>
                    ))}
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate('/demo/expenses')}>
                {t('common:dashboard.viewExpenses')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                {t('common:dashboard.upcomingEvents')}
              </CardTitle>
              <CardDescription>
                {upcomingEvents.length > 0
                  ? t('common:dashboard.nextEvents', { count: upcomingEvents.length })
                  : t('common:dashboard.eventSchedule')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{t('common:dashboard.noUpcomingEvents')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate('/demo/events')}
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{event.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {event.startDate && format(parseISO(event.startDate), 'PPp')}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Try RSVP Feature */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              {t('demo:tryRsvp.title')}
            </CardTitle>
            <CardDescription>{t('demo:tryRsvp.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/demo/rsvp')}>
              {t('demo:tryRsvp.button')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

/**
 * Demo page wrapper component
 * Provides DemoContext and renders the demo dashboard
 */
export function DemoPage() {
  return (
    <>
      <SEO page="demo" />
      <DemoProvider>
        <DemoDashboardContent />
      </DemoProvider>
    </>
  );
}
