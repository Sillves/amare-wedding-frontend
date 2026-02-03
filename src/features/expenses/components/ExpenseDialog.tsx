import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { getDateFnsLocale } from '@/lib/dateLocale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useCreateExpense, useUpdateExpense } from '../hooks/useExpenses';
import { EXPENSE_CATEGORIES } from '../utils/expenseCategory';
import type { WeddingExpenseDto, ExpenseCategory } from '../api/expensesApi';

const expenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  category: z.coerce.number().min(0).max(6),
  description: z.string().min(1, 'Description is required'),
  date: z.date(),
  notes: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseDialogProps {
  weddingId: string;
  expense?: WeddingExpenseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseDialog({
  weddingId,
  expense,
  open,
  onOpenChange,
}: ExpenseDialogProps) {
  const { t, i18n } = useTranslation(['expenses', 'common']);
  const locale = getDateFnsLocale(i18n.language);
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const isEditing = !!expense;

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category: 6,
      description: '',
      date: new Date(),
      notes: '',
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        amount: expense.amount || 0,
        category: expense.category ?? 6,
        description: expense.description || '',
        date: expense.date ? new Date(expense.date) : new Date(),
        notes: expense.notes || '',
      });
    } else {
      form.reset({
        amount: 0,
        category: 6,
        description: '',
        date: new Date(),
        notes: '',
      });
    }
  }, [expense, form]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (isEditing && expense?.id) {
        await updateExpense.mutateAsync({
          expenseId: expense.id,
          weddingId,
          data: {
            amount: data.amount,
            category: data.category as ExpenseCategory,
            description: data.description,
            date: data.date.toISOString(),
            notes: data.notes || null,
          },
        });
      } else {
        await createExpense.mutateAsync({
          weddingId,
          data: {
            amount: data.amount,
            category: data.category as ExpenseCategory,
            description: data.description,
            date: data.date.toISOString(),
            notes: data.notes || null,
          },
        });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error is handled by React Query
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('expenses:editExpense') : t('expenses:addExpense')}
          </DialogTitle>
          <DialogDescription>
            {t('expenses:subtitle')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expenses:form.amount')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        €
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t('expenses:form.amountPlaceholder')}
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expenses:form.category')}</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('expenses:form.categoryPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value.toString()}>
                          {t(cat.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expenses:form.description')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('expenses:form.descriptionPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('expenses:form.date')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale })
                          ) : (
                            <span>{t('expenses:form.datePlaceholder')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expenses:form.notes')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('expenses:form.notesPlaceholder')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('expenses:form.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={createExpense.isPending || updateExpense.isPending}
              >
                {createExpense.isPending || updateExpense.isPending
                  ? t('common:loading')
                  : t('expenses:form.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
