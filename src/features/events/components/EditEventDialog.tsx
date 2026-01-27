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
import { useUpdateEvent } from '../hooks/useEvents';
import type { EventDto, UpdateEventRequest } from '@/features/weddings/types';

interface EditEventDialogProps {
  event: EventDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEventDialog({ event, open, onOpenChange }: EditEventDialogProps) {
  const { t } = useTranslation('events');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const updateEvent = useUpdateEvent();

  useEffect(() => {
    if (event) {
      setName(event.name || '');
      // Convert ISO datetime to datetime-local format
      setStartDate(event.startDate ? event.startDate.slice(0, 16) : '');
      setEndDate(event.endDate ? event.endDate.slice(0, 16) : '');
      setLocation(event.location || '');
      setDescription(event.description || '');
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !name.trim() || !startDate) {
      return;
    }

    // Convert datetime-local to ISO 8601 with timezone
    const startDateISO = new Date(startDate).toISOString();
    const endDateISO = endDate ? new Date(endDate).toISOString() : startDateISO;

    const data: UpdateEventRequest = {
      name: name.trim(),
      startDate: startDateISO,
      endDate: endDateISO,
      location: location.trim() || null,
      description: description.trim() || null,
    };

    try {
      await updateEvent.mutateAsync({ eventId: event.id!, data });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName('');
      setStartDate('');
      setEndDate('');
      setLocation('');
      setDescription('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('actions.edit')}</DialogTitle>
            <DialogDescription>{t('editEventDescription')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">
                {t('form.name')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('form.namePlaceholder')}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startDate">
                  {t('form.startDate')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">{t('form.endDate')}</Label>
                <Input
                  id="edit-endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">{t('form.location')}</Label>
              <Input
                id="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('form.locationPlaceholder')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">{t('form.description')}</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('form.descriptionPlaceholder')}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={updateEvent.isPending || !name.trim() || !startDate}>
              {updateEvent.isPending ? t('actions.saving') : t('actions.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
