import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { getDateFnsLocale } from '@/lib/dateLocale';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import type { WeddingExpenseDto, ExpenseCategory } from '../api/expensesApi';
import { CATEGORY_COLORS } from '../utils/expenseCategory';

interface ExpenseTableProps {
  expenses: WeddingExpenseDto[];
  onEdit: (expense: WeddingExpenseDto) => void;
  onDelete: (expense: WeddingExpenseDto) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const { t, i18n } = useTranslation(['expenses', 'common']);
  const locale = getDateFnsLocale(i18n.language);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getCategoryLabel = (category: ExpenseCategory) => {
    const categoryMap: Record<ExpenseCategory, string> = {
      0: 'venue',
      1: 'catering',
      2: 'photography',
      3: 'decoration',
      4: 'attire',
      5: 'transport',
      6: 'other',
    };
    return t(`expenses:categories.${categoryMap[category]}`);
  };

  const columns: DataTableColumn<WeddingExpenseDto>[] = useMemo(() => [
    {
      key: 'date',
      header: t('expenses:table.date'),
      sortable: true,
      render: (expense) => (
        <span className="font-medium">
          {expense.date ? format(new Date(expense.date), 'dd MMM yyyy', { locale }) : '-'}
        </span>
      ),
      sortFn: (a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      },
    },
    {
      key: 'description',
      header: t('expenses:table.description'),
      sortable: true,
      render: (expense) => (
        <div>
          <p className="font-medium">{expense.description || '-'}</p>
          {expense.notes && (
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {expense.notes}
            </p>
          )}
        </div>
      ),
      sortFn: (a, b) => (a.description || '').localeCompare(b.description || ''),
    },
    {
      key: 'category',
      header: t('expenses:table.category'),
      sortable: true,
      render: (expense) => (
        <Badge
          variant="secondary"
          style={{ backgroundColor: CATEGORY_COLORS[expense.category as ExpenseCategory] }}
          className="text-white"
        >
          {getCategoryLabel(expense.category as ExpenseCategory)}
        </Badge>
      ),
      sortFn: (a, b) => (a.category ?? 6) - (b.category ?? 6),
    },
    {
      key: 'amount',
      header: t('expenses:table.amount'),
      sortable: true,
      className: 'text-right',
      render: (expense) => (
        <span className="font-medium">{formatCurrency(expense.amount || 0)}</span>
      ),
      sortFn: (a, b) => (a.amount || 0) - (b.amount || 0),
    },
    {
      key: 'actions',
      header: t('expenses:table.actions'),
      className: 'w-[70px]',
      render: (expense) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(expense)}>
              <Pencil className="mr-2 h-4 w-4" />
              {t('expenses:editExpense')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(expense)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('expenses:deleteConfirmTitle')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [t, onEdit, onDelete]);

  return (
    <DataTable
      data={expenses}
      columns={columns}
      getRowKey={(expense) => expense.id || ''}
      defaultSortKey="date"
      defaultSortDirection="desc"
      itemsPerPageOptions={[10, 25, 50]}
      defaultItemsPerPage={10}
      fillContainer
      emptyMessage={t('expenses:noExpenses')}
    />
  );
}
