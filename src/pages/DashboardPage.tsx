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
  Send,
  Plus,
  ArrowRight,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { useAuth, useLogout, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useGuests } from '@/features/guests/hooks/useGuests';
import { useEvents } from '@/features/events/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateWeddingDialog } from '@/features/weddings/components/CreateWeddingDialog';
import { CreateGuestDialog } from '@/features/guests/components/CreateGuestDialog';
import { CreateEventDialog } from '@/features/events/components/CreateEventDialog';
import { format, formatDistanceToNow, differenceInDays, isBefore, isToday, parseISO } from 'date-fns';

export function DashboardPage() {
  const { t } = useTranslation(['common', 'weddings', 'guests', 'events', 'auth', 'billing']);
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const { data: weddings, isLoading } = useWeddings();

  // Fetch current user to get subscription tier
  useCurrentUser();

  // For now, focus on the first wedding (wedding couples typically have one)
  const wedding = weddings?.[0];
  const { data: guests } = useGuests(wedding?.id || '', { enabled: !!wedding?.id });
  const { data: events } = useEvents(wedding?.id || '', { enabled: !!wedding?.id });

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
        text: t('common:dashboard.daysUntil', { count: daysUntil })
      };
    } else {
      return {
        type: 'past',
        days: Math.abs(daysUntil),
        text: t('common:dashboard.past', { count: Math.abs(daysUntil) })
      };
    }
  }, [wedding?.date, t]);

  // Calculate guest statistics
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

  // Get upcoming events (next 3 events)
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

  // Calculate planning progress
  const progress = useMemo(() => {
    const hasGuests = (guestStats.total > 0);
    const hasEvents = (events?.length || 0) > 0;
    const hasInvitations = guestStats.withEmail > 0;
    const hasRsvps = guestStats.attending > 0 || guestStats.declined > 0;

    let completedSteps = 0;
    const totalSteps = 4;

    if (hasGuests) completedSteps++;
    if (hasEvents) completedSteps++;
    if (hasInvitations) completedSteps++;
    if (hasRsvps) completedSteps++;

    return {
      percentage: Math.round((completedSteps / totalSteps) * 100),
      hasGuests,
      hasEvents,
      hasInvitations,
      hasRsvps
    };
  }, [guestStats, events]);

  // No weddings state
  if (!isLoading && (!weddings || weddings.length === 0)) {
    return (
      <div className="min-h-screen bg-muted/40">
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold">{t('common:appName')}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                {t('common:profile')}
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                {t('auth:logout')}
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <div className="mb-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-3xl font-bold mb-2">{t('weddings:noWeddings')}</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t('weddings:noWeddingsDescription')}
            </p>
            <CreateWeddingDialog>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                {t('weddings:createWedding')}
              </Button>
            </CreateWeddingDialog>
          </div>
        </main>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <p className="text-muted-foreground">{t('common:loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">{t('common:appName')}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              {t('common:profile')}
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              {t('auth:logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Welcome Header */}
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">{t('common:dashboard.welcome')}, {user?.name?.split(' ')[0] || user?.name}!</h2>
          <p className="text-muted-foreground">{t('common:tagline')}</p>
        </div>

        {/* Wedding Overview Card */}
        {wedding && (
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{wedding.title}</CardTitle>
                  {weddingCountdown && (
                    <Badge
                      variant={weddingCountdown.type === 'today' ? 'default' : weddingCountdown.type === 'future' ? 'info' : 'secondary'}
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
        )}

        {/* Guest Statistics */}
        <div>
          <h3 className="text-lg font-semibold mb-3">{t('guests:title')}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/guests?weddingId=${wedding?.id}`)}
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
              onClick={() => navigate(`/guests?weddingId=${wedding?.id}&status=attending`)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:attending')}</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{guestStats.attending}</div>
                <p className="text-xs text-muted-foreground">
                  {guestStats.total > 0 ? Math.round((guestStats.attending / guestStats.total) * 100) : 0}% {t('guests:stats.confirmed')}
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/guests?weddingId=${wedding?.id}&status=pending`)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:pending')}</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{guestStats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  {t('guests:stats.pending')}
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/guests?weddingId=${wedding?.id}&status=declined`)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('guests:declined')}</CardTitle>
                <UserX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{guestStats.declined}</div>
                <p className="text-xs text-muted-foreground">
                  {guestStats.total > 0 ? Math.round((guestStats.declined / guestStats.total) * 100) : 0}% {t('guests:stats.declined')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions & Upcoming Events */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('common:dashboard.quickActions')}</CardTitle>
              <CardDescription>Common tasks to manage your wedding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <CreateGuestDialog weddingId={wedding?.id || ''}>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('guests:addGuest')}
                </Button>
              </CreateGuestDialog>

              <CreateEventDialog weddingId={wedding?.id || ''}>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('events:addEvent')}
                </Button>
              </CreateEventDialog>

              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate(`/guests?weddingId=${wedding?.id}`)}
              >
                <Users className="h-4 w-4 mr-2" />
                {t('common:dashboard.viewAllGuests')}
              </Button>

              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate(`/events?weddingId=${wedding?.id}`)}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                {t('common:dashboard.viewAllEvents')}
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>{t('common:dashboard.upcomingEvents')}</CardTitle>
              <CardDescription>
                {upcomingEvents.length > 0
                  ? `Next ${upcomingEvents.length} event${upcomingEvents.length > 1 ? 's' : ''}`
                  : 'Your event schedule'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{t('common:dashboard.noUpcomingEvents')}</p>
                  <CreateEventDialog weddingId={wedding?.id || ''}>
                    <Button variant="link" className="mt-2">
                      {t('events:addEvent')}
                    </Button>
                  </CreateEventDialog>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/events?weddingId=${wedding?.id}`)}
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
                  {events && events.length > 3 && (
                    <Button
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => navigate(`/events?weddingId=${wedding?.id}`)}
                    >
                      View all {events.length} events
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>{t('common:dashboard.nextSteps')}</CardTitle>
            <CardDescription>{t('common:dashboard.nextStepsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {!progress.hasGuests && (
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t('common:dashboard.addFirstGuest')}</p>
                    <p className="text-xs text-muted-foreground">{t('common:dashboard.addFirstGuestDescription')}</p>
                  </div>
                  <CreateGuestDialog weddingId={wedding?.id || ''}>
                    <Button size="sm">{t('common:dashboard.addGuest')}</Button>
                  </CreateGuestDialog>
                </div>
              )}

              {!progress.hasEvents && (
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t('common:dashboard.createFirstEvent')}</p>
                    <p className="text-xs text-muted-foreground">{t('common:dashboard.createFirstEventDescription')}</p>
                  </div>
                  <CreateEventDialog weddingId={wedding?.id || ''}>
                    <Button size="sm">{t('common:dashboard.addEvent')}</Button>
                  </CreateEventDialog>
                </div>
              )}

              {progress.hasGuests && guestStats.notInvited > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <Send className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t('common:dashboard.sendInvitations')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('common:dashboard.sendInvitationsDescription', { count: guestStats.notInvited })}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => navigate(`/guests?weddingId=${wedding?.id}`)}>
                    {t('common:dashboard.sendInvites')}
                  </Button>
                </div>
              )}

              {/* Upgrade prompt for Free tier users */}
              {(user?.subscriptionTier === undefined || user?.subscriptionTier === 0) && (
                <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t('common:dashboard.upgradePlan')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('common:dashboard.upgradePlanDescription')}
                    </p>
                  </div>
                  <Button size="sm" variant="default" onClick={() => navigate('/pricing')}>
                    {t('common:dashboard.viewPlans')}
                  </Button>
                </div>
              )}

              {progress.hasGuests && progress.hasEvents && progress.hasRsvps && (
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t('common:dashboard.allSet')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('common:dashboard.allSetDescription')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
