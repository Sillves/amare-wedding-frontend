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
import { useDemoContext } from '../context/DemoContext';
import type { EventDto, GuestDto } from '@/features/weddings/types';

interface DemoManageEventGuestsDialogProps {
  event: EventDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoManageEventGuestsDialog({ event, open, onOpenChange }: DemoManageEventGuestsDialogProps) {
  const { t } = useTranslation('events');
  const { guests: allGuests, events, addGuestsToEvent, removeGuestsFromEvent } = useDemoContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'invited' | 'available'>('available');

  // Get the current event from context (to reflect any changes)
  const currentEvent = useMemo(() => {
    return events.find(e => e.id === event?.id) || event;
  }, [events, event]);

  // Get IDs of guests already invited to this event
  const invitedGuestIds = useMemo(() => {
    return new Set(currentEvent?.guestDtos?.map(g => g.id!) || []);
  }, [currentEvent?.guestDtos]);

  // Split guests into invited and available, and sort alphabetically by name
  const invitedGuests = useMemo(() => {
    const filtered = allGuests.filter((guest) => invitedGuestIds.has(guest.id!));
    return filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [allGuests, invitedGuestIds]);

  const availableGuests = useMemo(() => {
    const filtered = allGuests.filter((guest) => !invitedGuestIds.has(guest.id!));
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

  const handleAddSelected = () => {
    if (!currentEvent) return;
    addGuestsToEvent(currentEvent.id!, Array.from(selectedGuestIds));
    setSelectedGuestIds(new Set());
  };

  const handleRemoveSelected = () => {
    if (!currentEvent) return;
    removeGuestsFromEvent(currentEvent.id!, Array.from(selectedGuestIds));
    setSelectedGuestIds(new Set());
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
                      <p className="font-medium truncate">{guest.name || t('common:noName')}</p>
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
            {t('guestManagement.guestsInvitedFor', { count: invitedGuests.length, total: allGuests.length })}
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
                {t('guestManagement.availableGuestsTab')}
                <Badge variant="secondary" className="ml-1">
                  {filteredAvailableGuests.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="invited" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                {t('guestManagement.invitedGuestsTab')}
                <Badge variant="secondary" className="ml-1">
                  {filteredInvitedGuests.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="flex-1 overflow-hidden mt-4">
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
                      onClick={handleSelectAllAvailable}
                      disabled={filteredAvailableGuests.length === 0}
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
                  {filteredAvailableGuests.length === 0 ? (
                    <div className="p-8 text-center">
                      {searchQuery ? (
                        <p className="text-muted-foreground">{t('common:noResults')}</p>
                      ) : (
                        <p className="text-muted-foreground">{t('guestManagement.allGuestsAlreadyInvited')}</p>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredAvailableGuests.map((guest) => {
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
                              <p className="font-medium truncate">{guest.name || t('common:noName')}</p>
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
            </TabsContent>

            <TabsContent value="invited" className="flex-1 overflow-hidden mt-4">
              {renderGuestList(
                filteredInvitedGuests,
                searchQuery ? t('common:noResults') : t('guestManagement.noGuestsInvited'),
                handleSelectAllInvited
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t('actions.cancel')}
          </Button>
          {activeTab === 'invited' ? (
            <Button
              variant="outline"
              onClick={handleRemoveSelected}
              disabled={selectedGuestIds.size === 0}
            >
              <Minus className="h-4 w-4 mr-2" />
              {t('guestManagement.removeSelected', { count: selectedGuestIds.size })}
            </Button>
          ) : (
            <Button
              onClick={handleAddSelected}
              disabled={selectedGuestIds.size === 0}
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
