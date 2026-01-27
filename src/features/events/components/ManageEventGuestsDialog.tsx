import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Minus } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useGuests } from '@/features/guests/hooks/useGuests';
import { useAddGuestToEvent, useRemoveGuestFromEvent } from '../hooks/useEvents';
import type { EventDto } from '@/features/weddings/types';

interface ManageEventGuestsDialogProps {
  event: EventDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageEventGuestsDialog({ event, open, onOpenChange }: ManageEventGuestsDialogProps) {
  const { t } = useTranslation('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());

  const { data: allGuests } = useGuests(event?.weddingId || '');
  const addGuestToEvent = useAddGuestToEvent();
  const removeGuestFromEvent = useRemoveGuestFromEvent();

  const filteredGuests = allGuests?.filter((guest) =>
    guest.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleToggleGuest = (guestId: string) => {
    const newSelected = new Set(selectedGuestIds);
    if (newSelected.has(guestId)) {
      newSelected.delete(guestId);
    } else {
      newSelected.add(guestId);
    }
    setSelectedGuestIds(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedGuestIds(new Set(filteredGuests.map(g => g.id!)));
  };

  const handleDeselectAll = () => {
    setSelectedGuestIds(new Set());
  };

  const handleAddSelected = async () => {
    if (!event) return;

    try {
      await Promise.all(
        Array.from(selectedGuestIds).map(guestId =>
          addGuestToEvent.mutateAsync({ eventId: event.id!, guestId })
        )
      );
      setSelectedGuestIds(new Set());
    } catch (error) {
      console.error('Failed to add guests:', error);
    }
  };

  const handleRemoveSelected = async () => {
    if (!event) return;

    try {
      await Promise.all(
        Array.from(selectedGuestIds).map(guestId =>
          removeGuestFromEvent.mutateAsync({ eventId: event.id!, guestId })
        )
      );
      setSelectedGuestIds(new Set());
    } catch (error) {
      console.error('Failed to remove guests:', error);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedGuestIds(new Set());
    onOpenChange(false);
  };

  const isPending = addGuestToEvent.isPending || removeGuestFromEvent.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('guestManagement.title', { event: event?.name || '' })}</DialogTitle>
          <DialogDescription>{t('guestManagement.description')}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('guestManagement.searchGuests')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Selection Controls */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedGuestIds.size} {t('common:selected')}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                disabled={filteredGuests.length === 0}
              >
                {t('guestManagement.selectAll')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeselectAll}
                disabled={selectedGuestIds.size === 0}
              >
                {t('guestManagement.deselectAll')}
              </Button>
            </div>
          </div>

          {/* Guest List */}
          <div className="flex-1 overflow-y-auto border rounded-md">
            {filteredGuests.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery ? t('common:noResults') : t('guests:noGuests')}
              </div>
            ) : (
              <div className="divide-y">
                {filteredGuests.map((guest) => {
                  const isSelected = selectedGuestIds.has(guest.id!);

                  return (
                    <div
                      key={guest.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleToggleGuest(guest.id!)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleGuest(guest.id!)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{guest.name || 'No name'}</p>
                        {guest.email && (
                          <p className="text-sm text-muted-foreground truncate">{guest.email}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {t('actions.cancel')}
          </Button>
          <Button
            variant="outline"
            onClick={handleRemoveSelected}
            disabled={selectedGuestIds.size === 0 || isPending}
          >
            <Minus className="h-4 w-4 mr-2" />
            {t('guestManagement.removeSelected', { count: selectedGuestIds.size })}
          </Button>
          <Button
            onClick={handleAddSelected}
            disabled={selectedGuestIds.size === 0 || isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('guestManagement.addSelected', { count: selectedGuestIds.size })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
