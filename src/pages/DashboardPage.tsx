import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  UserCheck,
  UserX,
  Clock,
  MapPin,
  Send,
  Plus,
  ArrowRight,
  CalendarDays,
  Sparkles,
  Wallet,
  Globe,
  Pencil,
  ExternalLink,
  CircleCheck,
  CircleX,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { useAuth, useLogout, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useGuests } from '@/features/guests/hooks/useGuests';
import { useEvents } from '@/features/events/hooks/useEvents';
import { useWebsite } from '@/features/website/hooks/useWebsite';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditWeddingDialog } from '@/features/weddings/components/EditWeddingDialog';
import { CreateGuestDialog } from '@/features/guests/components/CreateGuestDialog';
import { CreateEventDialog } from '@/features/events/components/CreateEventDialog';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { FontSizeSwitcher } from '@/shared/components/FontSizeSwitcher';
import { format, differenceInDays, isBefore, isToday, parseISO } from 'date-fns';

/**
 * Floating decorative elements for premium dashboard aesthetic
 */
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating hearts */}
      <div className="absolute top-[10%] left-[5%] animate-float-slow opacity-20">
        <Heart className="h-6 w-6 text-primary fill-primary" />
      </div>
      <div className="absolute top-[30%] right-[8%] animate-float-medium opacity-15">
        <Heart className="h-5 w-5 text-primary fill-primary" />
      </div>
      <div className="absolute bottom-[20%] left-[12%] animate-float-fast opacity-10">
        <Heart className="h-8 w-8 text-primary fill-primary" />
      </div>

      {/* Sparkles */}
      <div className="absolute top-[15%] right-[20%] animate-pulse-slow opacity-25">
        <Sparkles className="h-4 w-4 text-amber-400" />
      </div>
      <div className="absolute bottom-[35%] left-[25%] animate-pulse-medium opacity-20">
        <Sparkles className="h-3 w-3 text-amber-400" />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-[40%] right-[3%] animate-spin-very-slow opacity-10">
        <div className="w-12 h-12 rounded-full border-2 border-primary" />
      </div>
      <div className="absolute bottom-[10%] left-[8%] animate-spin-very-slow-reverse opacity-10">
        <div className="w-10 h-10 rounded-full border-2 border-primary" />
      </div>
    </div>
  );
}

/**
 * Circular progress ring component
 */
function ProgressRing({ progress, size = 120, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-2xl font-serif font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Check if a date string represents a valid, user-set date
 */
function isValidWeddingDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const date = parseISO(dateString);
  return !isNaN(date.getTime()) && date.getFullYear() > 1900;
}

export function DashboardPage() {
  const { t } = useTranslation(['common', 'weddings', 'guests', 'events', 'auth', 'billing']);
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const { data: weddings, isLoading } = useWeddings();

  useCurrentUser();

  const wedding = weddings?.[0];
  const { data: guests } = useGuests(wedding?.id || '', { enabled: !!wedding?.id });
  const { data: events } = useEvents(wedding?.id || '', { enabled: !!wedding?.id });
  const { data: website } = useWebsite(wedding?.id || '', { enabled: !!wedding?.id });

  const canAccessWebsite = user?.subscriptionTier === 1 || user?.subscriptionTier === 2;
  const canSendEmails = user?.subscriptionTier === 1 || user?.subscriptionTier === 2;
  const hasValidDate = isValidWeddingDate(wedding?.date);

  const weddingCountdown = useMemo(() => {
    if (!hasValidDate || !wedding?.date) return null;
    const weddingDate = parseISO(wedding.date);
    const daysUntil = differenceInDays(weddingDate, new Date());

    if (isToday(weddingDate)) {
      return { type: 'today', days: 0, text: t('common:dashboard.today') };
    } else if (daysUntil > 0) {
      return { type: 'future', days: daysUntil, text: t('common:dashboard.daysUntil', { count: daysUntil }) };
    } else {
      return { type: 'past', days: Math.abs(daysUntil), text: t('common:dashboard.past', { count: Math.abs(daysUntil) }) };
    }
  }, [hasValidDate, wedding?.date, t]);

  const guestStats = useMemo(() => {
    if (!guests) return { total: 0, attending: 0, declined: 0, pending: 0, withEmail: 0, notInvited: 0 };
    return {
      total: guests.length,
      attending: guests.filter((g) => g.rsvpStatus === 1).length,
      declined: guests.filter((g) => g.rsvpStatus === 2).length,
      pending: guests.filter((g) => g.rsvpStatus === 0).length,
      withEmail: guests.filter((g) => g.email).length,
      notInvited: guests.filter((g) => !g.invitationSentAt).length,
    };
  }, [guests]);

  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    return events
      .filter(event => event.startDate && !isBefore(parseISO(event.startDate), now))
      .sort((a, b) => {
        const dateA = a.startDate ? parseISO(a.startDate) : new Date(0);
        const dateB = b.startDate ? parseISO(b.startDate) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3);
  }, [events]);

  const progress = useMemo(() => {
    const hasGuests = guestStats.total > 0;
    const hasEvents = (events?.length || 0) > 0;
    const hasInvitations = guestStats.withEmail > 0;
    const hasRsvps = guestStats.attending > 0 || guestStats.declined > 0;

    let completedSteps = 0;
    if (hasGuests) completedSteps++;
    if (hasEvents) completedSteps++;
    if (hasInvitations) completedSteps++;
    if (hasRsvps) completedSteps++;

    return {
      percentage: Math.round((completedSteps / 4) * 100),
      hasGuests,
      hasEvents,
      hasInvitations,
      hasRsvps
    };
  }, [guestStats, events]);

  if (!isLoading && (!weddings || weddings.length === 0)) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <Heart className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-serif">{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <FloatingElements />

      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <Heart className="h-6 w-6 text-primary fill-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <FontSizeSwitcher />
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            <span className="hidden md:inline text-sm text-muted-foreground">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('common:profile')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('auth:logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 relative">
        {/* Welcome Hero Section */}
        <section className="animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif font-semibold leading-tight">
                {t('common:dashboard.welcome')}, {user?.firstName}!
              </h1>
              <p className="text-lg text-muted-foreground">{t('common:tagline')}</p>
            </div>

            {/* Progress Ring */}
            <div className="flex items-center gap-6 animate-fade-in-up animation-delay-200">
              <ProgressRing progress={progress.percentage} />
              <div className="space-y-1">
                <p className="font-serif font-semibold text-lg">{t('common:dashboard.progress')}</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {progress.hasGuests ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />}
                    <span>{t('common:dashboard.guestsAdded')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {progress.hasEvents ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />}
                    <span>{t('common:dashboard.eventsCreated')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {progress.hasInvitations ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />}
                    <span>{t('common:dashboard.invitationsSent')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {progress.hasRsvps ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />}
                    <span>{t('common:dashboard.rsvpsReceived')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wedding Overview & Website Cards */}
        {wedding && (
          <section className="grid gap-6 lg:grid-cols-2 animate-fade-in-up animation-delay-300">
            {/* Wedding Overview Card */}
            <Card className="rounded-2xl border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-serif">{wedding.title}</CardTitle>
                    {weddingCountdown ? (
                      <Badge
                        variant={weddingCountdown.type === 'today' ? 'default' : weddingCountdown.type === 'future' ? 'info' : 'secondary'}
                        className="font-normal text-sm px-3 py-1"
                      >
                        {weddingCountdown.text}
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="font-normal">
                        {t('common:dashboard.dateNotSet')}
                      </Badge>
                    )}
                  </div>
                  <EditWeddingDialog wedding={wedding}>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </EditWeddingDialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('weddings:details.date')}</p>
                    <p className="text-sm text-muted-foreground">
                      {hasValidDate && wedding.date ? format(parseISO(wedding.date), 'PPP') : t('common:dashboard.dateNotSetDescription')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('weddings:details.location')}</p>
                    <p className="text-sm text-muted-foreground">{wedding.location || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Website Card */}
            <Card className="rounded-2xl border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-serif flex items-center gap-2">
                      <Globe className="h-6 w-6 text-primary" />
                      {t('common:dashboard.websiteBuilder')}
                    </CardTitle>
                    {canAccessWebsite ? (
                      website ? (
                        <Badge variant={website.isPublished ? 'success' : 'secondary'} className="font-normal">
                          {website.isPublished ? t('common:dashboard.websiteOnline') : t('common:dashboard.websiteOffline')}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="font-normal">
                          {t('common:dashboard.websiteNotCreated')}
                        </Badge>
                      )
                    ) : (
                      <Badge variant="warning" className="font-normal">
                        {t('common:dashboard.websiteRequiresUpgrade')}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {canAccessWebsite ? (
                  <>
                    {website && (
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {website.isPublished ? (
                            <CircleCheck className="h-5 w-5 text-green-600" />
                          ) : (
                            <CircleX className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{t('common:dashboard.websiteStatus')}</p>
                          <p className="text-sm text-muted-foreground">
                            {website.isPublished ? t('common:dashboard.websitePublished') : t('common:dashboard.websiteNotPublished')}
                          </p>
                        </div>
                      </div>
                    )}
                    {website?.isPublished && wedding.slug && (
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <ExternalLink className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{t('common:dashboard.websiteUrl')}</p>
                          <a
                            href={`${window.location.origin}/w/${wedding.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline truncate block"
                          >
                            {window.location.host}/w/{wedding.slug}
                          </a>
                        </div>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full rounded-xl hover:bg-primary/5 hover:border-primary/50 transition-all focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={() => navigate(`/website?weddingId=${wedding.id}`)}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {website ? t('common:dashboard.editWebsite') : t('common:dashboard.createWebsite')}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('common:dashboard.websiteUpgradePrompt')}
                    </p>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate('/pricing')}
                      className="shadow-lg shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {t('common:dashboard.viewPlans')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Guest Statistics */}
        <section className="space-y-4 animate-fade-in-up animation-delay-400">
          <h2 className="text-2xl font-serif font-semibold">{t('guests:title')}</h2>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {/* Total Guests */}
            <Card
              className="rounded-2xl border-border/50 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm group"
              onClick={() => navigate(`/guests?weddingId=${wedding?.id}`)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:totalGuests')}</CardTitle>
                <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                  <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold">{guestStats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('guests:stats.allGuests')}</p>
              </CardContent>
            </Card>

            {/* Attending */}
            <Card
              className="rounded-2xl border-border/50 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm group hover:border-green-500/30"
              onClick={() => navigate(`/guests?weddingId=${wedding?.id}&status=attending`)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:attending')}</CardTitle>
                <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold text-green-600">{guestStats.attending}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {guestStats.total > 0 ? Math.round((guestStats.attending / guestStats.total) * 100) : 0}% {t('guests:stats.confirmed')}
                </p>
              </CardContent>
            </Card>

            {/* Pending */}
            <Card
              className="rounded-2xl border-border/50 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm group hover:border-amber-500/30"
              onClick={() => navigate(`/guests?weddingId=${wedding?.id}&status=pending`)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:pending')}</CardTitle>
                <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold text-amber-600">{guestStats.pending}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('guests:stats.pending')}</p>
              </CardContent>
            </Card>

            {/* Declined */}
            <Card
              className="rounded-2xl border-border/50 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm group hover:border-red-500/30"
              onClick={() => navigate(`/guests?weddingId=${wedding?.id}&status=declined`)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:declined')}</CardTitle>
                <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                  <UserX className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold text-red-600">{guestStats.declined}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {guestStats.total > 0 ? Math.round((guestStats.declined / guestStats.total) * 100) : 0}% {t('guests:stats.declined')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions & Upcoming Events */}
        <section className="grid gap-6 lg:grid-cols-2 animate-fade-in-up animation-delay-600">
          {/* Quick Actions - Compact Icon Grid */}
          <Card className="rounded-2xl border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl">{t('common:dashboard.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <CreateGuestDialog weddingId={wedding?.id || ''}>
                  <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all group">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-center">{t('guests:addGuest')}</span>
                  </button>
                </CreateGuestDialog>

                <CreateEventDialog weddingId={wedding?.id || ''}>
                  <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all group">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <CalendarDays className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-center">{t('events:addEvent')}</span>
                  </button>
                </CreateEventDialog>

                <button
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all group"
                  onClick={() => navigate(`/guests?weddingId=${wedding?.id}`)}
                >
                  <div className="p-3 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
                    <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-center">{t('guests:title')}</span>
                </button>

                <button
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all group"
                  onClick={() => navigate(`/events?weddingId=${wedding?.id}`)}
                >
                  <div className="p-3 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
                    <Calendar className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-center">{t('events:title')}</span>
                </button>

                <button
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all group"
                  onClick={() => navigate(`/expenses?weddingId=${wedding?.id}`)}
                >
                  <div className="p-3 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
                    <Wallet className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-center">{t('expenses:title')}</span>
                </button>

                {canAccessWebsite && (
                  <button
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all group"
                    onClick={() => navigate(`/website?weddingId=${wedding?.id}`)}
                  >
                    <div className="p-3 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
                      <Globe className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-xs font-medium text-center">{t('website:title')}</span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="rounded-2xl border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-serif text-xl">{t('common:dashboard.upcomingEvents')}</CardTitle>
              <CardDescription>
                {upcomingEvents.length > 0
                  ? t('common:dashboard.nextEvents', { count: upcomingEvents.length })
                  : t('common:dashboard.eventSchedule')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="p-4 rounded-full bg-muted/30 w-fit mx-auto mb-4">
                    <Calendar className="h-10 w-10 opacity-50" />
                  </div>
                  <p className="text-sm">{t('common:dashboard.noUpcomingEvents')}</p>
                  <CreateEventDialog weddingId={wedding?.id || ''}>
                    <Button variant="link" className="mt-2 text-primary">
                      {t('events:addEvent')}
                    </Button>
                  </CreateEventDialog>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 hover:border-primary/30 transition-all cursor-pointer group"
                      onClick={() => navigate(`/events?weddingId=${wedding?.id}`)}
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{event.name}</p>
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
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                  {events && events.length > 3 && (
                    <Button
                      variant="ghost"
                      className="w-full text-sm rounded-xl hover:bg-primary/5"
                      onClick={() => navigate(`/events?weddingId=${wedding?.id}`)}
                    >
                      {t('common:dashboard.viewAllEventsCount', { count: events.length })}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Next Steps */}
        <section className="animate-fade-in-up animation-delay-600">
          <Card className="rounded-2xl border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-serif text-xl">{t('common:dashboard.nextSteps')}</CardTitle>
              <CardDescription>{t('common:dashboard.nextStepsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Upgrade prompt for Free tier users */}
                {(user?.subscriptionTier === undefined || user?.subscriptionTier === 0) && (
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('common:dashboard.upgradePlan')}</p>
                      <p className="text-sm text-muted-foreground">{t('common:dashboard.upgradePlanDescription')}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate('/pricing')}
                      className="shadow-lg shadow-primary/25"
                    >
                      {t('common:dashboard.viewPlans')}
                    </Button>
                  </div>
                )}

                {/* Set wedding date prompt */}
                {wedding && !hasValidDate && (
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('common:dashboard.dateNotSet')}</p>
                      <p className="text-sm text-muted-foreground">{t('common:dashboard.dateNotSetDescription')}</p>
                    </div>
                    <EditWeddingDialog wedding={wedding}>
                      <Button size="sm" variant="outline" className="rounded-xl">{t('common:edit')}</Button>
                    </EditWeddingDialog>
                  </div>
                )}

                {!progress.hasGuests && (
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('common:dashboard.addFirstGuest')}</p>
                      <p className="text-sm text-muted-foreground">{t('common:dashboard.addFirstGuestDescription')}</p>
                    </div>
                    <CreateGuestDialog weddingId={wedding?.id || ''}>
                      <Button size="sm" className="rounded-xl">{t('common:dashboard.addGuest')}</Button>
                    </CreateGuestDialog>
                  </div>
                )}

                {!progress.hasEvents && (
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('common:dashboard.createFirstEvent')}</p>
                      <p className="text-sm text-muted-foreground">{t('common:dashboard.createFirstEventDescription')}</p>
                    </div>
                    <CreateEventDialog weddingId={wedding?.id || ''}>
                      <Button size="sm" className="rounded-xl">{t('common:dashboard.addEvent')}</Button>
                    </CreateEventDialog>
                  </div>
                )}

                {canSendEmails && progress.hasGuests && guestStats.notInvited > 0 && (
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <Send className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('common:dashboard.sendInvitations')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('common:dashboard.sendInvitationsDescription', { count: guestStats.notInvited })}
                      </p>
                    </div>
                    <Button size="sm" className="rounded-xl" onClick={() => navigate(`/guests?weddingId=${wedding?.id}`)}>
                      {t('common:dashboard.sendInvites')}
                    </Button>
                  </div>
                )}

                {canAccessWebsite && !website && (
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('common:dashboard.createWebsite')}</p>
                      <p className="text-sm text-muted-foreground">{t('common:dashboard.createWebsiteDescription')}</p>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/website?weddingId=${wedding?.id}`)} className="rounded-xl shadow-lg shadow-primary/25">
                      {t('common:create')}
                    </Button>
                  </div>
                )}

                {progress.hasGuests && progress.hasEvents && progress.hasRsvps && (
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-green-500/30 bg-green-500/5">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('common:dashboard.allSet')}</p>
                      <p className="text-sm text-muted-foreground">{t('common:dashboard.allSetDescription')}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
