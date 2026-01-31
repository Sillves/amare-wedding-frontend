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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-time-picker';
import { useDemoContext } from '../context/DemoContext';
import { EXPENSE_CATEGORIES } from '@/features/expenses/utils/expenseCategory';
import type { WeddingExpenseDto, ExpenseCategory } from '@/features/expenses/api/expensesApi';

// ==================== CREATE/EDIT EXPENSE ====================

interface DemoExpenseDialogProps {
  expense?: WeddingExpenseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoExpenseDialog({ expense, open, onOpenChange }: DemoExpenseDialogProps) {
  const { t } = useTranslation('expenses');
  const { addExpense, updateExpense } = useDemoContext();
  const isEditing = !!expense;

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('0');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      if (expense) {
        setDescription(expense.description || '');
        setAmount(String(expense.amount ?? ''));
        setCategory(String(expense.category ?? 0));
        setDate(expense.date ? new Date(expense.date) : undefined);
        setNotes(expense.notes || '');
      } else {
        resetForm();
      }
    }
  }, [expense, open]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('0');
    setDate(undefined);
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount) return;

    const expenseData = {
      description: description.trim(),
      amount: parseFloat(amount),
      category: parseInt(category) as ExpenseCategory,
      date: date ? date.toISOString() : undefined,
      notes: notes.trim() || undefined,
    };

    if (isEditing && expense) {
      updateExpense(expense.id!, expenseData);
    } else {
      addExpense(expenseData);
    }

    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t('editExpense') : t('addExpense')}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? t('editExpenseDescription') : t('addExpenseDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="expense-description">
                {t('form.description')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="expense-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('form.descriptionPlaceholder')}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expense-amount">
                  {t('form.amount')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expense-category">{t('form.category')}</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="expense-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={String(cat.value)}>
                        {t(cat.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>{t('form.date')}</Label>
              <DatePicker
                value={date}
                onChange={setDate}
                placeholder={t('form.datePlaceholder')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-notes">{t('form.notes')}</Label>
              <Textarea
                id="expense-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('form.notesPlaceholder')}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={!description.trim() || !amount}>
              {isEditing ? t('actions.save') : t('actions.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== DELETE EXPENSE ====================

interface DemoDeleteExpenseDialogProps {
  expense: WeddingExpenseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoDeleteExpenseDialog({ expense, open, onOpenChange }: DemoDeleteExpenseDialogProps) {
  const { t } = useTranslation('expenses');
  const { deleteExpense } = useDemoContext();

  const handleDelete = () => {
    if (!expense) return;
    deleteExpense(expense.id!);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t('deleteExpense')}</DialogTitle>
          <DialogDescription>
            {t('deleteExpenseConfirmation', { description: expense?.description })}
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
