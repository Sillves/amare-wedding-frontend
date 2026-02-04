import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventCard } from '@/features/events/components/EventCard';
import { DemoProvider, useDemoContext } from '@/features/demo/context/DemoContext';
import { DemoLayout } from '@/features/demo/components/DemoLayout';
import {
  DemoCreateEventDialog,
  DemoEditEventDialog,
  DemoDeleteEventDialog,
} from '@/features/demo/components/DemoEventDialogs';
import { DemoManageEventGuestsDialog } from '@/features/demo/components/DemoManageEventGuestsDialog';
import type { EventDto } from '@/features/weddings/types';

function DemoEventsContent() {
  const { t } = useTranslation(['events', 'common', 'demo', 'guests', 'expenses', 'website']);
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
    <DemoLayout>
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
    </DemoLayout>
  );
}

export function DemoEventsPage() {
  return (
    <DemoProvider>
      <DemoEventsContent />
    </DemoProvider>
  );
}
