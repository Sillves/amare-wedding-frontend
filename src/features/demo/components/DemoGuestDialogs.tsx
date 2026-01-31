import { useState } from 'react';
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
import { useDemoContext } from '../context/DemoContext';
import type { GuestDto, RsvpStatus } from '@/features/weddings/types';

// ==================== CREATE GUEST ====================

interface DemoCreateGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoCreateGuestDialog({ open, onOpenChange }: DemoCreateGuestDialogProps) {
  const { t } = useTranslation('guests');
  const { addGuest } = useDemoContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    addGuest({
      name: name.trim(),
      email: email.trim() || null,
      rsvpStatus: 0 as RsvpStatus,
      preferredLanguage: 'en',
    });

    setName('');
    setEmail('');
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName('');
      setEmail('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('addGuest')}</DialogTitle>
            <DialogDescription>{t('addGuestDescription')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="demo-name">
                {t('form.name')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="demo-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('form.namePlaceholder')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="demo-email">{t('form.email')}</Label>
              <Input
                id="demo-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('form.emailPlaceholder')}
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

// ==================== EDIT GUEST ====================

interface DemoEditGuestDialogProps {
  guest: GuestDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoEditGuestDialog({ guest, open, onOpenChange }: DemoEditGuestDialogProps) {
  const { t } = useTranslation('guests');
  const { updateGuest } = useDemoContext();
  const [name, setName] = useState(guest?.name || '');
  const [email, setEmail] = useState(guest?.email || '');
  const [rsvpStatus, setRsvpStatus] = useState<string>(String(guest?.rsvpStatus ?? 0));

  // Update form when guest changes
  useState(() => {
    if (guest) {
      setName(guest.name || '');
      setEmail(guest.email || '');
      setRsvpStatus(String(guest.rsvpStatus ?? 0));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!guest || !name.trim()) return;

    updateGuest(guest.id!, {
      name: name.trim(),
      email: email.trim() || null,
      rsvpStatus: parseInt(rsvpStatus) as RsvpStatus,
    });

    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && guest) {
      setName(guest.name || '');
      setEmail(guest.email || '');
      setRsvpStatus(String(guest.rsvpStatus ?? 0));
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('editGuest')}</DialogTitle>
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">{t('form.status')}</Label>
              <Select value={rsvpStatus} onValueChange={setRsvpStatus}>
                <SelectTrigger id="edit-status">
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
            <Button type="submit" disabled={!name.trim()}>
              {t('actions.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== DELETE GUEST ====================

interface DemoDeleteGuestDialogProps {
  guest: GuestDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoDeleteGuestDialog({ guest, open, onOpenChange }: DemoDeleteGuestDialogProps) {
  const { t } = useTranslation('guests');
  const { deleteGuest } = useDemoContext();

  const handleDelete = () => {
    if (!guest) return;
    deleteGuest(guest.id!);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t('deleteGuest')}</DialogTitle>
          <DialogDescription>
            {t('deleteGuestConfirmation', { name: guest?.name })}
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
