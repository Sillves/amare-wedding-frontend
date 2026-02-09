import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2 } from 'lucide-react';
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
import { useUpsertBudget } from '../hooks/useBudget';
import type { WeddingBudgetDto } from '../api/budgetApi';
import { EXPENSE_CATEGORIES } from '@/features/expenses/utils/expenseCategory';
import type { ExpenseCategory } from '@/features/expenses/api/expensesApi';

const budgetSchema = z.object({
  totalBudget: z.coerce.number().positive('Total budget must be greater than 0'),
  allocations: z.array(
    z.object({
      category: z.coerce.number().min(0).max(6),
      amount: z.coerce.number().min(0, 'Amount must not be negative'),
    })
  ),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetDialogProps {
  weddingId: string;
  budget?: WeddingBudgetDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetDialog({
  weddingId,
  budget,
  open,
  onOpenChange,
}: BudgetDialogProps) {
  const { t } = useTranslation(['expenses', 'common']);
  const upsertBudget = useUpsertBudget();

  const defaultAllocations = EXPENSE_CATEGORIES.map((cat) => ({
    category: cat.value as number,
    amount: 0,
  }));

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      totalBudget: 0,
      allocations: defaultAllocations,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'allocations',
  });

  useEffect(() => {
    if (budget && budget.totalBudget) {
      const allocationMap = new Map(
        (budget.allocations || []).map((a) => [a.category, a.amount || 0])
      );
      form.reset({
        totalBudget: budget.totalBudget,
        allocations: EXPENSE_CATEGORIES.map((cat) => ({
          category: cat.value as number,
          amount: allocationMap.get(cat.value) || 0,
        })),
      });
    } else {
      form.reset({
        totalBudget: 0,
        allocations: defaultAllocations,
      });
    }
  }, [budget, open, form]);

  const watchedAllocations = form.watch('allocations');
  const watchedTotal = form.watch('totalBudget');

  const totalAllocated = useMemo(
    () => watchedAllocations.reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
    [watchedAllocations]
  );

  const unallocated = (Number(watchedTotal) || 0) - totalAllocated;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleAutoDistribute = () => {
    const total = Number(watchedTotal) || 0;
    if (total <= 0) return;

    const currentAllocations = form.getValues('allocations');
    const allocatedCategories = currentAllocations.filter((a) => Number(a.amount) > 0);
    const emptyCategories = currentAllocations.filter((a) => Number(a.amount) <= 0);

    if (emptyCategories.length === 0) return;

    const alreadyAllocated = allocatedCategories.reduce(
      (sum, a) => sum + (Number(a.amount) || 0),
      0
    );
    const remaining = total - alreadyAllocated;
    if (remaining <= 0) return;

    const perCategory = Math.floor((remaining / emptyCategories.length) * 100) / 100;

    currentAllocations.forEach((alloc, index) => {
      if (Number(alloc.amount) <= 0) {
        form.setValue(`allocations.${index}.amount`, perCategory);
      }
    });
  };

  const onSubmit = async (data: BudgetFormData) => {
    try {
      const filteredAllocations = data.allocations
        .filter((a) => Number(a.amount) > 0)
        .map((a) => ({
          category: a.category as ExpenseCategory,
          amount: Number(a.amount),
        }));

      await upsertBudget.mutateAsync({
        weddingId,
        data: {
          totalBudget: Number(data.totalBudget),
          allocations: filteredAllocations,
        },
      });
      onOpenChange(false);
    } catch {
      // Error handled by React Query
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {budget ? t('expenses:budget.editBudget') : t('expenses:budget.setBudget')}
          </DialogTitle>
          <DialogDescription>
            {t('expenses:budget.setupDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="totalBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expenses:budget.totalBudget')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        &euro;
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="25000"
                        className="pl-8 text-lg font-medium"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel>{t('expenses:budget.categoryBudget')}</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAutoDistribute}
                  className="text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  {t('expenses:budget.autoDistribute')}
                </Button>
              </div>

              {fields.map((field, index) => {
                const category = EXPENSE_CATEGORIES[index]!;
                const amount = Number(watchedAllocations[index]?.amount) || 0;
                const percentage =
                  Number(watchedTotal) > 0
                    ? ((amount / Number(watchedTotal)) * 100).toFixed(1)
                    : '0.0';

                return (
                  <div key={field.id} className="flex items-center gap-3">
                    <span className="text-sm w-28 flex-shrink-0 truncate">
                      {t(category.labelKey)}
                    </span>
                    <FormField
                      control={form.control}
                      name={`allocations.${index}.amount`}
                      render={({ field: inputField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                                &euro;
                              </span>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                className="pl-6 h-8 text-sm"
                                {...inputField}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-xs text-muted-foreground w-14 text-right flex-shrink-0">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('expenses:budget.totalAllocated')}
                </span>
                <span className="font-medium">{formatCurrency(totalAllocated)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('expenses:budget.unallocated')}
                </span>
                <span
                  className={`font-medium ${
                    unallocated < 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {formatCurrency(unallocated)}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('expenses:form.cancel')}
              </Button>
              <Button type="submit" disabled={upsertBudget.isPending}>
                {upsertBudget.isPending
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
