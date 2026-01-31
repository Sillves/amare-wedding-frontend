import { useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render: (item: T) => ReactNode;
  sortFn?: (a: T, b: T) => number;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (item: T) => string;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  maxHeight?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  defaultSortKey,
  defaultSortDirection = 'asc',
  itemsPerPageOptions = [10, 25, 50],
  defaultItemsPerPage = 10,
  maxHeight = '400px',
  onRowClick,
  emptyMessage,
}: DataTableProps<T>) {
  const { t } = useTranslation('common');
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const handleSort = (key: string) => {
    const column = columns.find((c) => c.key === key);
    if (!column?.sortable) return;

    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;

    const column = columns.find((c) => c.key === sortKey);
    if (!column?.sortFn) return 0;

    const comparison = column.sortFn(a, b);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Reset to page 1 if current page is out of bounds
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const getSortIndicator = (key: string) => {
    if (sortKey !== key) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  if (data.length === 0 && emptyMessage) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table with fixed height and scroll */}
      <div className="rounded-md border overflow-x-auto">
        <div className="overflow-y-auto min-w-[640px]" style={{ maxHeight }}>
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`${column.sortable ? 'cursor-pointer hover:text-foreground' : ''} ${column.className || ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    {column.header}
                    {column.sortable && getSortIndicator(column.key)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow
                  key={getRowKey(item)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render(item)}
                    </TableCell>
                  ))}
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
              {t('showing')} {startIndex + 1}-{Math.min(endIndex, sortedData.length)} {t('of')} {sortedData.length}
            </span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
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
              {t('page')} {currentPage} {t('of')} {totalPages}
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
