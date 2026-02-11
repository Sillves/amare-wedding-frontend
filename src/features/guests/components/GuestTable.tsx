import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, Mail, ChevronLeft, ChevronRight, Send, Check, X, Sparkles, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { GuestDto, RsvpStatus } from '@/features/weddings/types';

interface GuestTableProps {
  guests: GuestDto[];
  onEdit: (guest: GuestDto) => void;
  onDelete: (guest: GuestDto) => void;
  onSendInvitation: (guest: GuestDto) => void;
  onBulkSendInvitations?: (guestIds: string[]) => void;
  canSendEmails?: boolean;
  onUpgrade?: () => void;
}

/**
 * Get RSVP status badge variant based on status value
 * RsvpStatus enum: 0 = Pending, 1 = Accepted, 2 = Declined, 3 = Maybe
 */
function getRsvpBadgeVariant(status: RsvpStatus): 'warning' | 'success' | 'destructive' | 'info' {
  switch (status) {
    case 0: // Pending
      return 'warning';
    case 1: // Accepted
      return 'success';
    case 2: // Declined
      return 'destructive';
    case 3: // Maybe
      return 'info';
    default:
      return 'warning';
  }
}

/**
 * Get RSVP status translation key
 */
function getRsvpStatusKey(status: RsvpStatus): string {
  switch (status) {
    case 0:
      return 'rsvpStatus.pending';
    case 1:
      return 'rsvpStatus.attending';
    case 2:
      return 'rsvpStatus.declined';
    case 3:
      return 'rsvpStatus.maybe';
    default:
      return 'rsvpStatus.pending';
  }
}

export function GuestTable({ guests, onEdit, onDelete, onSendInvitation, onBulkSendInvitations, canSendEmails = true, onUpgrade }: GuestTableProps) {
  const { t } = useTranslation('guests');
  const [sortField, setSortField] = useState<'name' | 'email' | 'rsvpStatus'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());

  const handleSort = (field: 'name' | 'email' | 'rsvpStatus') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedGuests = [...guests].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle null/undefined values
    if (!aValue) aValue = '';
    if (!bValue) bValue = '';

    if (sortField === 'rsvpStatus') {
      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }

    const comparison = String(aValue).localeCompare(String(bValue));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedGuests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGuests = sortedGuests.slice(startIndex, endIndex);

  // Reset to page 1 if current page is out of bounds
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all guests with email addresses (can send invitations)
      const selectableIds = paginatedGuests
        .filter(g => g.email && g.id)
        .map(g => g.id!);
      setSelectedGuestIds(new Set(selectableIds));
    } else {
      setSelectedGuestIds(new Set());
    }
  };

  const handleSelectGuest = (guestId: string, checked: boolean) => {
    const newSelected = new Set(selectedGuestIds);
    if (checked) {
      newSelected.add(guestId);
    } else {
      newSelected.delete(guestId);
    }
    setSelectedGuestIds(newSelected);
  };

  const handleBulkSend = () => {
    if (onBulkSendInvitations && selectedGuestIds.size > 0) {
      onBulkSendInvitations(Array.from(selectedGuestIds));
      setSelectedGuestIds(new Set());
    }
  };

  const selectableGuests = paginatedGuests.filter(g => g.email);
  const allSelectableSelected = selectableGuests.length > 0 &&
    selectableGuests.every(g => g.id && selectedGuestIds.has(g.id));

  if (guests.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">{t('noGuests')}</p>
        <p className="text-sm text-muted-foreground mt-2">{t('noGuestsDescription')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upgrade prompt for Free tier users */}
      {!canSendEmails && onUpgrade && (
        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-md">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{t('upgrade.sendInvitations')}</p>
              <p className="text-xs text-muted-foreground">{t('upgrade.sendInvitationsDescription')}</p>
            </div>
          </div>
          <Button onClick={onUpgrade} size="sm" variant="default">
            {t('upgrade.viewPlans')}
          </Button>
        </div>
      )}

      {/* Bulk Actions - Only show if user can send emails */}
      {canSendEmails && onBulkSendInvitations && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 bg-muted rounded-md min-h-[52px]">
          {selectedGuestIds.size > 0 ? (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedGuestIds.size} {t('common:selected')}
              </span>
              <Button onClick={handleBulkSend} size="sm">
                <Send className="h-4 w-4 mr-2" />
                {t('actions.sendInvite')} ({selectedGuestIds.size})
              </Button>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              Select guests to send invitations
            </span>
          )}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-2">
        {paginatedGuests.map((guest) => (
          <div
            key={guest.id}
            className="rounded-md border p-3 space-y-1.5"
            onClick={() => {
              if (canSendEmails && onBulkSendInvitations && guest.email && guest.id) {
                handleSelectGuest(guest.id, !selectedGuestIds.has(guest.id));
              }
            }}
          >
            <div className="flex items-center gap-2">
              {canSendEmails && onBulkSendInvitations && (
                <Checkbox
                  checked={guest.id ? selectedGuestIds.has(guest.id) : false}
                  onCheckedChange={(checked) => guest.id && handleSelectGuest(guest.id, checked as boolean)}
                  aria-label={`Select ${guest.name}`}
                  disabled={!guest.email}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{guest.name || '-'}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={getRsvpBadgeVariant(guest.rsvpStatus ?? 0)}>
                      {t(getRsvpStatusKey(guest.rsvpStatus ?? 0))}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(guest)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          {t('actions.edit')}
                        </DropdownMenuItem>
                        {canSendEmails && (
                          <DropdownMenuItem onClick={() => onSendInvitation(guest)} disabled={!guest.email}>
                            <Mail className="mr-2 h-4 w-4" />
                            {t('actions.sendInvite')}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(guest)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('actions.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {guest.email && (
                  <p className="text-sm text-muted-foreground truncate">{guest.email}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  {guest.invitationSentAt ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Check className="h-3 w-3" />
                      {new Date(guest.invitationSentAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {t('invitationSent')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block rounded-md border overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto min-w-[640px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                {canSendEmails && onBulkSendInvitations && (
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={allSelectableSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                <TableHead
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('name')}
                >
                  {t('form.name')}
                  {sortField === 'name' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('email')}
                >
                  {t('form.email')}
                  {sortField === 'email' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('rsvpStatus')}
                >
                  {t('rsvp.title')}
                  {sortField === 'rsvpStatus' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </TableHead>
                <TableHead>{t('invitationSent')}</TableHead>
                <TableHead className="text-right">{t('actions.title')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGuests.map((guest) => (
                <TableRow
                  key={guest.id}
                  className={canSendEmails && onBulkSendInvitations && guest.email ? "cursor-pointer" : ""}
                  onClick={(e) => {
                    if (canSendEmails && onBulkSendInvitations && guest.email && guest.id) {
                      const target = e.target as HTMLElement;
                      if (!target.closest('button')) {
                        handleSelectGuest(guest.id, !selectedGuestIds.has(guest.id));
                      }
                    }
                  }}
                >
                  {canSendEmails && onBulkSendInvitations && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={guest.id ? selectedGuestIds.has(guest.id) : false}
                        onCheckedChange={(checked) => guest.id && handleSelectGuest(guest.id, checked as boolean)}
                        aria-label={`Select ${guest.name}`}
                        disabled={!guest.email}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{guest.name || '-'}</TableCell>
                  <TableCell>{guest.email || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={getRsvpBadgeVariant(guest.rsvpStatus ?? 0)}>
                      {t(getRsvpStatusKey(guest.rsvpStatus ?? 0))}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {guest.invitationSentAt ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(guest.invitationSentAt).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      {canSendEmails && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSendInvitation(guest)}
                          title={t('actions.sendInvite')}
                          disabled={!guest.email}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(guest)}
                        title={t('actions.edit')}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(guest)}
                        title={t('actions.delete')}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t('common:showing')} {startIndex + 1}-{Math.min(endIndex, sortedGuests.length)} {t('common:of')} {sortedGuests.length}
            </span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {t('common:page')} {currentPage} {t('common:of')} {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
