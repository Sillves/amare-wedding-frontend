import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calendar, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventCard } from '@/features/events/components/EventCard';
import { DemoProvider, useDemoContext } from '@/features/demo/context/DemoContext';
import { DemoBanner } from '@/features/demo/components/DemoBanner';
import {
  DemoCreateEventDialog,
  DemoEditEventDialog,
  DemoDeleteEventDialog,
} from '@/features/demo/components/DemoEventDialogs';
import { DemoManageEventGuestsDialog } from '@/features/demo/components/DemoManageEventGuestsDialog';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import type { EventDto } from '@/features/weddings/types';

function DemoEventsContent() {
  const { t } = useTranslation(['events', 'common', 'demo', 'guests', 'expenses']);
  const navigate = useNavigate();
  const { events } = useDemoContext();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manageGuestsDialogOpen, setManageGuestsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);

  // Sort events by start date
  const sortedEvents = [...events].sort((a, b) => {
    if (!a.startDate || !b.startDate) return 0;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const handleEdit = (event: EventDto) => {
    setSelectedEvent(event);
    setEditDialogOpen(true);
  };

  const handleDelete = (event: EventDto) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleManageGuests = (event: EventDto) => {
    setSelectedEvent(event);
    setManageGuestsDialogOpen(true);
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
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo')}>
              {t('common:dashboard.title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/guests')}>
              {t('guests:title')}
            </Button>
            <Button
              variant="ghost"
              className="rounded-none border-b-2 border-primary"
              onClick={() => navigate('/demo/events')}
            >
              {t('events:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/expenses')}>
              {t('expenses:title')}
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

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">{t('events:title')}</h2>
            <p className="text-muted-foreground">{t('events:manageDescription')}</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('events:addEvent')}
          </Button>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('events:eventList')}</CardTitle>
            <CardDescription>
              {t('events:eventListDescription', { wedding: 'Emma & James' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {sortedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  guestCount={event.guestDtos?.length || 0}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onManageGuests={handleManageGuests}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      <DemoCreateEventDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <DemoEditEventDialog
        event={selectedEvent}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DemoDeleteEventDialog
        event={selectedEvent}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
      <DemoManageEventGuestsDialog
        event={selectedEvent}
        open={manageGuestsDialogOpen}
        onOpenChange={setManageGuestsDialogOpen}
      />
    </div>
  );
}

export function DemoEventsPage() {
  return (
    <DemoProvider>
      <DemoEventsContent />
    </DemoProvider>
  );
}
