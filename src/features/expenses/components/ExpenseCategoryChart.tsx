import { useTranslation } from 'react-i18next';
import { CATEGORY_COLORS } from '../utils/expenseCategory';
import type { ExpenseCategory } from '../api/expensesApi';

interface CategoryData {
  name: string;
  value: number;
}

interface ExpenseCategoryChartProps {
  data: CategoryData[];
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

export function ExpenseCategoryChart({ data }: ExpenseCategoryChartProps) {
  const { t } = useTranslation(['expenses']);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-4">
      {sortedData.map((item) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        const categoryId = CATEGORY_NAME_TO_ID[item.name] ?? 6;
        const colorClass = CATEGORY_COLORS[categoryId];

        return (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {t(`expenses:categories.${item.name.toLowerCase()}`)}
              </span>
              <span className="text-muted-foreground">
                {formatCurrency(item.value)} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%`, backgroundColor: colorClass }}
              />
            </div>
          </div>
        );
      })}

      <div className="pt-4 border-t flex justify-between font-medium">
        <span>{t('expenses:summary.totalSpent')}</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
