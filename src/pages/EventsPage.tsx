import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Heart, Sparkles, CalendarDays, MapPin } from 'lucide-react';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useEvents } from '@/features/events/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventCard } from '@/features/events/components/EventCard';
import { CreateEventDialog } from '@/features/events/components/CreateEventDialog';
import { EditEventDialog } from '@/features/events/components/EditEventDialog';
import { DeleteEventDialog } from '@/features/events/components/DeleteEventDialog';
import { ManageEventGuestsDialog } from '@/features/events/components/ManageEventGuestsDialog';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { FontSizeSwitcher } from '@/shared/components/FontSizeSwitcher';
import type { EventDto } from '@/features/weddings/types';
import { format, parseISO, isBefore } from 'date-fns';

/**
 * Floating decorative elements for premium aesthetic
 */
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating hearts */}
      <div className="absolute top-[12%] left-[6%] animate-float-slow opacity-15">
        <Heart className="h-5 w-5 text-primary fill-primary" />
      </div>
      <div className="absolute top-[28%] right-[7%] animate-float-medium opacity-10">
        <Heart className="h-4 w-4 text-primary fill-primary" />
      </div>
      <div className="absolute bottom-[25%] left-[10%] animate-float-fast opacity-10">
        <Heart className="h-6 w-6 text-primary fill-primary" />
      </div>

      {/* Sparkles */}
      <div className="absolute top-[18%] right-[12%] animate-pulse-slow opacity-20">
        <Sparkles className="h-4 w-4 text-amber-400" />
      </div>
      <div className="absolute bottom-[30%] left-[22%] animate-pulse-medium opacity-15">
        <Sparkles className="h-3 w-3 text-amber-400" />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-[40%] right-[4%] animate-spin-very-slow opacity-10">
        <div className="w-10 h-10 rounded-full border-2 border-primary" />
      </div>
    </div>
  );
}

export function EventsPage() {
  const { t } = useTranslation(['events', 'auth', 'common', 'weddings']);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const logout = useLogout();

  const weddingIdFromUrl = searchParams.get('weddingId');

  // Optimization: Only fetch all weddings if we don't have a weddingId in URL
  // When weddingId is in URL, we already have context and don't need to fetch all weddings
  const { data: weddings, isLoading: weddingsLoading } = useWeddings({
    enabled: !weddingIdFromUrl
  });

  // Get wedding ID from URL params or use first wedding (when no URL param)
  const selectedWeddingId = weddingIdFromUrl || weddings?.[0]?.id || '';

  // Fetch events for the selected wedding
  const { data: events, isLoading: eventsLoading, error } = useEvents(selectedWeddingId);

  const [editingEvent, setEditingEvent] = useState<EventDto | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventDto | null>(null);
  const [managingGuestsEvent, setManagingGuestsEvent] = useState<EventDto | null>(null);

  const selectedWedding = weddings?.find((w) => w.id === selectedWeddingId);

  // Sort events by start date and separate upcoming from past
  const { upcomingEvents, pastEvents } = useMemo(() => {
    if (!events) return { upcomingEvents: [], pastEvents: [] };

    const now = new Date();
    const sorted = [...events].sort((a, b) => {
      if (!a.startDate || !b.startDate) return 0;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

    return {
      upcomingEvents: sorted.filter(e => e.startDate && !isBefore(parseISO(e.startDate), now)),
      pastEvents: sorted.filter(e => e.startDate && isBefore(parseISO(e.startDate), now))
    };
  }, [events]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: events?.length || 0,
      upcoming: upcomingEvents.length,
      past: pastEvents.length,
      totalGuests: events?.reduce((acc, e) => acc + (e.guestDtos?.length || 0), 0) || 0
    };
  }, [events, upcomingEvents, pastEvents]);

  if (weddingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <Heart className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-serif">{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  if (!weddingIdFromUrl && (!weddings || weddings.length === 0)) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <Heart className="h-6 w-6 text-primary fill-primary transition-transform group-hover:scale-110" />
              <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                {t('auth:logout')}
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 relative">
          <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center bg-card/80 backdrop-blur-sm">
            <p className="mb-4 text-muted-foreground">{t('weddings:noWeddings')}</p>
            <Button onClick={() => navigate('/dashboard')} className="rounded-xl shadow-lg shadow-primary/25">
              {t('weddings:createWedding')}
            </Button>
          </div>
        </main>
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <Heart className="h-6 w-6 text-primary fill-primary transition-transform group-hover:scale-110" />
              <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <FontSizeSwitcher />
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            <span className="hidden md:inline text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout} className="rounded-xl">
              {t('auth:logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 relative">
        {/* Header with title and action */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-semibold">{t('events:title')}</h1>
            <p className="text-muted-foreground">{t('events:manageDescription')}</p>
          </div>
          <CreateEventDialog weddingId={selectedWeddingId}>
            <Button className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow">
              <Calendar className="h-4 w-4 mr-2" />
              {t('events:addEvent')}
            </Button>
          </CreateEventDialog>
        </section>

        {/* Statistics Cards */}
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4 animate-fade-in-up animation-delay-200">
          {/* Total Events */}
          <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('events:stats.totalEvents')}</CardTitle>
              <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                <CalendarDays className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('events:stats.allEvents')}</p>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group hover:border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('events:stats.upcoming')}</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-green-600">{stats.upcoming}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('events:stats.comingSoon')}</p>
            </CardContent>
          </Card>

          {/* Past Events */}
          <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group hover:border-muted-foreground/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('events:stats.past')}</CardTitle>
              <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted/70 transition-colors">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-muted-foreground">{stats.past}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('events:stats.completed')}</p>
            </CardContent>
          </Card>

          {/* Total Guests Across Events */}
          <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group hover:border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('events:stats.guestsAssigned')}</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-blue-600">{stats.totalGuests}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('events:stats.acrossEvents')}</p>
            </CardContent>
          </Card>
        </section>

        {/* Events List */}
        {selectedWeddingId && (
          <section className="animate-fade-in-up animation-delay-400">
            <Card className="rounded-2xl border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl">{t('events:eventList')}</CardTitle>
                {selectedWedding && (
                  <CardDescription>
                    {t('events:eventListDescription', { wedding: selectedWedding.title })}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="p-8 text-center">
                    <Heart className="h-8 w-8 text-primary mx-auto animate-pulse mb-4" />
                    <p className="text-muted-foreground">{t('common:loading')}</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <p className="text-destructive">{t('common:error')}</p>
                  </div>
                ) : events && events.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center bg-muted/20">
                    <div className="p-4 rounded-full bg-muted/30 w-fit mx-auto mb-4">
                      <Calendar className="h-10 w-10 text-muted-foreground opacity-50" />
                    </div>
                    <p className="text-muted-foreground">{t('events:noEvents')}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t('events:noEventsDescription')}
                    </p>
                    <CreateEventDialog weddingId={selectedWeddingId}>
                      <Button variant="link" className="mt-4 text-primary">
                        {t('events:addEvent')}
                      </Button>
                    </CreateEventDialog>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Upcoming Events */}
                    {upcomingEvents.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          {t('events:stats.upcoming')}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {upcomingEvents.map((event) => (
                            <EventCard
                              key={event.id}
                              event={event}
                              guestCount={event.guestDtos?.length ?? 0}
                              onEdit={setEditingEvent}
                              onDelete={setDeletingEvent}
                              onManageGuests={setManagingGuestsEvent}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Past Events */}
                    {pastEvents.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          {t('events:stats.past')}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 opacity-75">
                          {pastEvents.map((event) => (
                            <EventCard
                              key={event.id}
                              event={event}
                              guestCount={event.guestDtos?.length ?? 0}
                              onEdit={setEditingEvent}
                              onDelete={setDeletingEvent}
                              onManageGuests={setManagingGuestsEvent}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      {/* Edit Dialog */}
      <EditEventDialog
        event={editingEvent}
        open={!!editingEvent}
        onOpenChange={(open) => !open && setEditingEvent(null)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteEventDialog
        event={deletingEvent}
        open={!!deletingEvent}
        onOpenChange={(open) => !open && setDeletingEvent(null)}
      />

      {/* Manage Guests Dialog */}
      <ManageEventGuestsDialog
        event={managingGuestsEvent}
        open={!!managingGuestsEvent}
        onOpenChange={(open) => !open && setManagingGuestsEvent(null)}
      />
    </div>
  );
}
