import { useTranslation } from 'react-i18next';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WeddingBudgetDto } from '../api/budgetApi';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from '@/features/expenses/utils/expenseCategory';
import type { ExpenseCategory } from '@/features/expenses/api/expensesApi';

interface CategorySpending {
  [key: string]: number;
}

interface BudgetCategoryBreakdownProps {
  budget: WeddingBudgetDto;
  categoryTotals: CategorySpending;
  onEditClick: () => void;
  className?: string;
}

const CATEGORY_NAME_TO_ID: Record<string, ExpenseCategory> = {
  Venue: 0,
  Catering: 1,
  Photography: 2,
  Decoration: 3,
  Attire: 4,
  Transport: 5,
  Other: 6,
};

export function BudgetCategoryBreakdown({
  budget,
  categoryTotals,
  onEditClick,
  className,
}: BudgetCategoryBreakdownProps) {
  const { t } = useTranslation(['expenses']);

  const allocationMap = new Map(
    (budget.allocations || []).map((a) => [a.category, a.amount || 0])
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getBarColor = (percentage: number) => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-green-500';
  };

  // Build rows: show all categories that have either an allocation or spending
  const rows = EXPENSE_CATEGORIES.map((cat) => {
    const allocated = allocationMap.get(cat.value) || 0;
    const categoryName =
      Object.entries(CATEGORY_NAME_TO_ID).find(([, v]) => v === cat.value)?.[0] || '';
    const spent = categoryTotals[categoryName] || 0;
    const percentage = allocated > 0 ? (spent / allocated) * 100 : spent > 0 ? 100 : 0;

    return {
      category: cat,
      allocated,
      spent,
      percentage,
      color: CATEGORY_COLORS[cat.value],
    };
  }).filter((row) => row.allocated > 0 || row.spent > 0);

  return (
    <Card className={`rounded-2xl border-border/50 shadow-lg bg-card/80 backdrop-blur-sm flex flex-col min-h-0 ${className || ''}`}>
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-xl">
            {t('expenses:budget.categoryBudget')}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4 mr-1" />
            {t('expenses:budget.editBudget')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 min-h-0 overflow-y-auto">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t('expenses:noExpenses')}
          </p>
        ) : (
          rows.map((row) => (
            <div key={row.category.value} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{t(row.category.labelKey)}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(row.spent)} / {formatCurrency(row.allocated)}
                </span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${getBarColor(row.percentage)}`}
                  style={{
                    width: `${Math.min(row.percentage, 100)}%`,
                    backgroundColor: row.percentage <= 80 ? row.color : undefined,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{row.percentage.toFixed(0)}% {t('expenses:budget.ofBudget')}</span>
                <span>
                  {row.allocated - row.spent >= 0
                    ? `${formatCurrency(row.allocated - row.spent)} ${t('expenses:budget.remaining').toLowerCase()}`
                    : `${formatCurrency(row.spent - row.allocated)} ${t('expenses:budget.overBudget').toLowerCase()}`}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
