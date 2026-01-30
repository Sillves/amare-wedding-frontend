import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteExpense } from '../hooks/useExpenses';
import type { WeddingExpenseDto } from '../api/expensesApi';

interface DeleteExpenseDialogProps {
  expense: WeddingExpenseDto | null;
  weddingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteExpenseDialog({
  expense,
  weddingId,
  open,
  onOpenChange,
}: DeleteExpenseDialogProps) {
  const { t } = useTranslation(['expenses', 'common']);
  const deleteExpense = useDeleteExpense();

  const handleDelete = async () => {
    if (!expense?.id) return;

    try {
      await deleteExpense.mutateAsync({
        expenseId: expense.id,
        weddingId,
      });
      onOpenChange(false);
    } catch (error) {
      // Error is handled by React Query
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('expenses:deleteConfirmTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('expenses:deleteConfirmDescription')}
            {expense && (
              <span className="block mt-2 font-medium text-foreground">
                {expense.description} - {formatCurrency(expense.amount || 0)}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('expenses:form.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteExpense.isPending}
          >
            {deleteExpense.isPending ? t('common:loading') : t('expenses:deleteConfirmTitle')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
