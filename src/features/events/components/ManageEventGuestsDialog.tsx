import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Minus, UserCheck } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGuests } from '@/features/guests/hooks/useGuests';
import { useAddGuestsToEvent, useRemoveGuestsFromEvent, useEvent } from '../hooks/useEvents';
import type { EventDto, GuestDto } from '@/features/weddings/types';

interface ManageEventGuestsDialogProps {
  event: EventDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageEventGuestsDialog({ event, open, onOpenChange }: ManageEventGuestsDialogProps) {
  const { t } = useTranslation('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'invited' | 'available'>('available');

  // Fetch the latest event data to ensure we have up-to-date guest list
  // Fallback to the prop event if query hasn't loaded yet
  const { data: fetchedEvent } = useEvent(event?.id || '');
  const currentEvent = fetchedEvent || event;

  const { data: allGuests } = useGuests(currentEvent?.weddingId || '');
  const addGuestsToEvent = useAddGuestsToEvent();
  const removeGuestsFromEvent = useRemoveGuestsFromEvent();

  // Get IDs of guests already invited to this event
  const invitedGuestIds = useMemo(() => {
    return new Set(currentEvent?.guestDtos?.map(g => g.id!) || []);
  }, [currentEvent?.guestDtos]);

  // Split guests into invited and available, and sort alphabetically by name
  const invitedGuests = useMemo(() => {
    const filtered = allGuests?.filter((guest) => invitedGuestIds.has(guest.id!)) || [];
    return filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [allGuests, invitedGuestIds]);

  const availableGuests = useMemo(() => {
    const filtered = allGuests?.filter((guest) => !invitedGuestIds.has(guest.id!)) || [];
    return filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [allGuests, invitedGuestIds]);

  // Filter based on search query
  const filteredInvitedGuests = invitedGuests.filter((guest) =>
    guest.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableGuests = availableGuests.filter((guest) =>
    guest.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleGuest = (guestId: string) => {
    const newSelected = new Set(selectedGuestIds);
    if (newSelected.has(guestId)) {
      newSelected.delete(guestId);
    } else {
      newSelected.add(guestId);
    }
    setSelectedGuestIds(newSelected);
  };

  const handleSelectAllInvited = () => {
    setSelectedGuestIds(new Set(filteredInvitedGuests.map(g => g.id!)));
  };

  const handleSelectAllAvailable = () => {
    setSelectedGuestIds(new Set(filteredAvailableGuests.map(g => g.id!)));
  };

  const handleDeselectAll = () => {
    setSelectedGuestIds(new Set());
  };

  const handleAddSelected = async () => {
    if (!currentEvent) return;

    try {
      await addGuestsToEvent.mutateAsync({
        eventId: currentEvent.id!,
        guestIds: Array.from(selectedGuestIds)
      });
      setSelectedGuestIds(new Set());
    } catch (error) {
      // Error handled by React Query
    }
  };

  const handleRemoveSelected = async () => {
    if (!currentEvent) return;

    try {
      await removeGuestsFromEvent.mutateAsync({
        eventId: currentEvent.id!,
        guestIds: Array.from(selectedGuestIds)
      });
      setSelectedGuestIds(new Set());
    } catch (error) {
      // Error handled by React Query
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedGuestIds(new Set());
    setActiveTab('available');
    onOpenChange(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'invited' | 'available');
    setSelectedGuestIds(new Set()); // Clear selection when switching tabs
  };

  const isPending = addGuestsToEvent.isPending || removeGuestsFromEvent.isPending;

  const renderGuestList = (guests: GuestDto[], emptyMessage: string, onSelectAll: () => void) => {
    return (
      <div className="space-y-3">
        {/* Selection Controls */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selectedGuestIds.size} {t('common:selected')}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
              disabled={guests.length === 0}
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
        <div className="overflow-y-auto border rounded-md max-h-[400px]">
          {guests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="divide-y">
              {guests.map((guest) => {
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
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('guestManagement.title', { event: currentEvent?.name || '' })}</DialogTitle>
          <DialogDescription>
            {invitedGuests.length} van {allGuests?.length || 0} gasten uitgenodigd voor dit event
          </DialogDescription>
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

          {/* Tabs for Invited and Available guests */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available" className="flex items-center gap-2">
                Beschikbare gasten
                <Badge variant="secondary" className="ml-1">
                  {filteredAvailableGuests.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="invited" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Uitgenodigde gasten
                <Badge variant="secondary" className="ml-1">
                  {filteredInvitedGuests.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="flex-1 overflow-hidden mt-4">
              {renderGuestList(
                filteredAvailableGuests,
                searchQuery ? t('common:noResults') : 'Alle gasten zijn al uitgenodigd',
                handleSelectAllAvailable
              )}
            </TabsContent>

            <TabsContent value="invited" className="flex-1 overflow-hidden mt-4">
              {renderGuestList(
                filteredInvitedGuests,
                searchQuery ? t('common:noResults') : 'Geen gasten uitgenodigd voor dit event',
                handleSelectAllInvited
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {t('actions.cancel')}
          </Button>
          {activeTab === 'invited' ? (
            <Button
              variant="outline"
              onClick={handleRemoveSelected}
              disabled={selectedGuestIds.size === 0 || isPending}
            >
              <Minus className="h-4 w-4 mr-2" />
              {t('guestManagement.removeSelected', { count: selectedGuestIds.size })}
            </Button>
          ) : (
            <Button
              onClick={handleAddSelected}
              disabled={selectedGuestIds.size === 0 || isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('guestManagement.addSelected', { count: selectedGuestIds.size })}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
