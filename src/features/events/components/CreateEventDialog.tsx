import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { useCreateEvent } from '../hooks/useEvents';
import { useErrorToast } from '@/hooks/useErrorToast';
import type { CreateEventRequest } from '@/features/weddings/types';

interface CreateEventDialogProps {
  weddingId: string;
  children: React.ReactNode;
}

export function CreateEventDialog({ weddingId, children }: CreateEventDialogProps) {
  const { t } = useTranslation('events');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const createEvent = useCreateEvent();
  const { showError, showSuccess } = useErrorToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !startDate || !location.trim()) {
      return;
    }

    // Convert Date to ISO 8601
    const startDateISO = startDate.toISOString();
    const endDateISO = endDate ? endDate.toISOString() : startDateISO;

    const data: CreateEventRequest = {
      name: name.trim(),
      startDate: startDateISO,
      endDate: endDateISO,
      location: location.trim(),
      description: description.trim() || null,
    };

    try {
      await createEvent.mutateAsync({ weddingId, data });
      showSuccess(t('messages.created'));
      setOpen(false);
      // Reset form
      setName('');
      setStartDate(undefined);
      setEndDate(undefined);
      setLocation('');
      setDescription('');
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
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('addEvent')}</DialogTitle>
            <DialogDescription>{t('addEventDescription')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                {t('form.name')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('form.namePlaceholder')}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">
                  {t('form.startDate')} <span className="text-destructive">*</span>
                </Label>
                <DateTimePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder={t('form.startDatePlaceholder')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">{t('form.endDate')}</Label>
                <DateTimePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder={t('form.endDatePlaceholder')}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">
                {t('form.location')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('form.locationPlaceholder')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('form.description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('form.descriptionPlaceholder')}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={createEvent.isPending || !name.trim() || !startDate || !location.trim()}>
              {createEvent.isPending ? t('actions.creating') : t('actions.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
