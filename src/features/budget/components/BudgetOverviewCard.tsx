import { useTranslation } from 'react-i18next';
import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WeddingBudgetDto } from '../api/budgetApi';

interface BudgetOverviewCardProps {
  budget: WeddingBudgetDto;
  totalSpent: number;
}

export function BudgetOverviewCard({ budget, totalSpent }: BudgetOverviewCardProps) {
  const { t } = useTranslation(['expenses']);

  const totalBudget = budget.totalBudget || 0;
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getStatusColor = () => {
    if (percentage > 100) return 'text-red-600';
    if (percentage >= 80) return 'text-amber-600';
    return 'text-green-600';
  };

  const getBarColor = () => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getStatusLabel = () => {
    if (percentage > 100) return t('expenses:budget.overBudget');
    if (percentage >= 80) return t('expenses:budget.onTrack');
    return t('expenses:budget.underBudget');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {t('expenses:budget.totalBudget')}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Target className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-serif font-bold">
          {formatCurrency(totalBudget)}
        </div>

        <div className="space-y-1.5">
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getBarColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {formatCurrency(totalSpent)} {t('expenses:budget.spent').toLowerCase()}
            </span>
            <span className={getStatusColor()}>
              {getStatusLabel()}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-sm pt-1 border-t">
          <span className="text-muted-foreground">{t('expenses:budget.remaining')}</span>
          <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(remaining)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
