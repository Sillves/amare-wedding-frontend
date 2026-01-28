import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
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

export function GuestTable({ guests, onEdit, onDelete, onSendInvitation }: GuestTableProps) {
  const { t } = useTranslation('guests');
  const [sortField, setSortField] = useState<'name' | 'email' | 'rsvpStatus'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

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
      {/* Table with fixed height and scroll */}
      <div className="rounded-md border">
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
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
                <TableHead className="text-right">{t('actions.title')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.name || '-'}</TableCell>
                  <TableCell>{guest.email || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={getRsvpBadgeVariant(guest.rsvpStatus ?? 0)}>
                      {t(getRsvpStatusKey(guest.rsvpStatus ?? 0))}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSendInvitation(guest)}
                        title={t('actions.sendInvite')}
                        disabled={!guest.email}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-2">
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
