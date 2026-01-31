import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { useDemoContext } from '../context/DemoContext';
import type { EventDto } from '@/features/weddings/types';

// ==================== CREATE EVENT ====================

interface DemoCreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoCreateEventDialog({ open, onOpenChange }: DemoCreateEventDialogProps) {
  const { t } = useTranslation('events');
  const { addEvent } = useDemoContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    addEvent({
      name: name.trim(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setLocation('');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('addEvent')}</DialogTitle>
            <DialogDescription>{t('addEventDescription')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="event-name">
                {t('form.name')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('form.namePlaceholder')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-description">{t('form.description')}</Label>
              <Textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('form.descriptionPlaceholder')}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-location">{t('form.location')}</Label>
              <Input
                id="event-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('form.locationPlaceholder')}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('form.startDate')}</Label>
              <DateTimePicker
                value={startDate}
                onChange={setStartDate}
                placeholder={t('form.startDatePlaceholder')}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('form.endDate')}</Label>
              <DateTimePicker
                value={endDate}
                onChange={setEndDate}
                placeholder={t('form.endDatePlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {t('actions.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== EDIT EVENT ====================

interface DemoEditEventDialogProps {
  event: EventDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoEditEventDialog({ event, open, onOpenChange }: DemoEditEventDialogProps) {
  const { t } = useTranslation('events');
  const { updateEvent } = useDemoContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (event && open) {
      setName(event.name || '');
      setDescription(event.description || '');
      setLocation(event.location || '');
      setStartDate(event.startDate ? new Date(event.startDate) : undefined);
      setEndDate(event.endDate ? new Date(event.endDate) : undefined);
    }
  }, [event, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !name.trim()) return;

    updateEvent(event.id!, {
      name: name.trim(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('editEvent')}</DialogTitle>
            <DialogDescription>{t('editEventDescription')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="edit-event-name">
                {t('form.name')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-event-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('form.namePlaceholder')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-event-description">{t('form.description')}</Label>
              <Textarea
                id="edit-event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('form.descriptionPlaceholder')}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-event-location">{t('form.location')}</Label>
              <Input
                id="edit-event-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('form.locationPlaceholder')}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('form.startDate')}</Label>
              <DateTimePicker
                value={startDate}
                onChange={setStartDate}
                placeholder={t('form.startDatePlaceholder')}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('form.endDate')}</Label>
              <DateTimePicker
                value={endDate}
                onChange={setEndDate}
                placeholder={t('form.endDatePlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {t('actions.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== DELETE EVENT ====================

interface DemoDeleteEventDialogProps {
  event: EventDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoDeleteEventDialog({ event, open, onOpenChange }: DemoDeleteEventDialogProps) {
  const { t } = useTranslation('events');
  const { deleteEvent } = useDemoContext();

  const handleDelete = () => {
    if (!event) return;
    deleteEvent(event.id!);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t('deleteEvent')}</DialogTitle>
          <DialogDescription>
            {t('deleteEventConfirmation', { name: event?.name })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('actions.cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {t('actions.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
