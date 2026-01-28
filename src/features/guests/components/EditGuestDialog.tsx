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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateGuest } from '../hooks/useGuests';
import type { GuestDto, UpdateGuestRequest, RsvpStatus } from '@/features/weddings/types';

interface EditGuestDialogProps {
  guest: GuestDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGuestDialog({ guest, open, onOpenChange }: EditGuestDialogProps) {
  const { t } = useTranslation('guests');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>(0);
  const updateGuest = useUpdateGuest();

  useEffect(() => {
    if (guest) {
      setName(guest.name || '');
      setEmail(guest.email || '');
      setRsvpStatus(guest.rsvpStatus ?? 0);
    }
  }, [guest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guest || !name.trim()) {
      return;
    }

    const data: UpdateGuestRequest = {
      name: name.trim(),
      email: email.trim() || null,
      rsvpStatus,
    };

    try {
      await updateGuest.mutateAsync({ guestId: guest.id!, data });
      onOpenChange(false);
    } catch (error) {
      // Error handled by React Query
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName('');
      setEmail('');
      setRsvpStatus(0);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('actions.edit')}</DialogTitle>
            <DialogDescription>{t('editGuestDescription')}</DialogDescription>
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
                autoComplete="name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">{t('form.email')}</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('form.emailPlaceholder')}
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rsvp-status">{t('rsvp.title')}</Label>
              <Select
                value={rsvpStatus.toString()}
                onValueChange={(value) => setRsvpStatus(parseInt(value) as RsvpStatus)}
              >
                <SelectTrigger id="edit-rsvp-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t('rsvpStatus.pending')}</SelectItem>
                  <SelectItem value="1">{t('rsvpStatus.attending')}</SelectItem>
                  <SelectItem value="2">{t('rsvpStatus.declined')}</SelectItem>
                  <SelectItem value="3">{t('rsvpStatus.maybe')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={updateGuest.isPending || !name.trim()}>
              {updateGuest.isPending ? t('actions.saving') : t('actions.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
