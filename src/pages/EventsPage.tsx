import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useEvents } from '@/features/events/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventCard } from '@/features/events/components/EventCard';
import { CreateEventDialog } from '@/features/events/components/CreateEventDialog';
import { EditEventDialog } from '@/features/events/components/EditEventDialog';
import { DeleteEventDialog } from '@/features/events/components/DeleteEventDialog';
import { ManageEventGuestsDialog } from '@/features/events/components/ManageEventGuestsDialog';
import type { EventDto } from '@/features/weddings/types';

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

  const handleWeddingChange = (weddingId: string) => {
    setSearchParams({ weddingId });
  };

  const selectedWedding = weddings?.find((w) => w.id === selectedWeddingId);

  // Sort events by start date
  const sortedEvents = events ? [...events].sort((a, b) => {
    if (!a.startDate || !b.startDate) return 0;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  }) : [];

  if (weddingsLoading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <p className="text-muted-foreground">{t('common:loading')}</p>
      </div>
    );
  }

  if (!weddingIdFromUrl && (!weddings || weddings.length === 0)) {
    return (
      <div className="min-h-screen bg-muted/40">
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold">{t('common:appName')}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                {t('auth:logout')}
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="mb-4 text-muted-foreground">{t('weddings:noWeddings')}</p>
            <Button onClick={() => navigate('/dashboard')}>{t('weddings:createWedding')}</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">{t('common:appName')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              {t('auth:logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Header with wedding selector */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">{t('events:title')}</h2>
            <p className="text-muted-foreground">{t('events:manageDescription')}</p>
          </div>
          <div className="flex items-center gap-2">
            {weddings && weddings.length > 1 && (
              <Select value={selectedWeddingId} onValueChange={handleWeddingChange}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder={t('weddings:selectWedding')} />
                </SelectTrigger>
                <SelectContent>
                  {weddings.map((wedding) => (
                    <SelectItem key={wedding.id} value={wedding.id}>
                      {wedding.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <CreateEventDialog weddingId={selectedWeddingId}>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                {t('events:addEvent')}
              </Button>
            </CreateEventDialog>
          </div>
        </div>

        {/* Events List */}
        {selectedWeddingId && (
          <Card>
            <CardHeader>
              <CardTitle>{t('events:eventList')}</CardTitle>
              {selectedWedding && (
                <CardDescription>
                  {t('events:eventListDescription', { wedding: selectedWedding.title })}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">{t('common:loading')}</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-destructive">{t('common:error')}</p>
                </div>
              ) : sortedEvents.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">{t('events:noEvents')}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('events:noEventsDescription')}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {sortedEvents.map((event) => (
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
              )}
            </CardContent>
          </Card>
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
