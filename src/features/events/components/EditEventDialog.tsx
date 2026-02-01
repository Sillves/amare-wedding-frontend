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
import { useUpdateEvent } from '../hooks/useEvents';
import { useErrorToast } from '@/hooks/useErrorToast';
import type { EventDto, UpdateEventRequest } from '@/features/weddings/types';

interface EditEventDialogProps {
  event: EventDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEventDialog({ event, open, onOpenChange }: EditEventDialogProps) {
  const { t } = useTranslation('events');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const updateEvent = useUpdateEvent();
  const { showError, showSuccess } = useErrorToast();

  useEffect(() => {
    if (event) {
      setName(event.name || '');
      setStartDate(event.startDate ? new Date(event.startDate) : undefined);
      setEndDate(event.endDate ? new Date(event.endDate) : undefined);
      setLocation(event.location || '');
      setDescription(event.description || '');
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !name.trim() || !startDate) {
      return;
    }

    // Convert Date to ISO 8601
    const startDateISO = startDate.toISOString();
    const endDateISO = endDate ? endDate.toISOString() : startDateISO;

    const data: UpdateEventRequest = {
      name: name.trim(),
      startDate: startDateISO,
      endDate: endDateISO,
      location: location.trim() || null,
      description: description.trim() || null,
    };

    try {
      await updateEvent.mutateAsync({ eventId: event.id!, data });
      showSuccess(t('messages.updated'));
      onOpenChange(false);
    } catch (error) {
      showError(error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName('');
      setStartDate(undefined);
      setEndDate(undefined);
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
                <DateTimePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder={t('form.startDatePlaceholder')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">{t('form.endDate')}</Label>
                <DateTimePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder={t('form.endDatePlaceholder')}
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
