import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Wallet, TrendingUp, CheckCircle2, Circle, ClipboardList, ChevronDown } from 'lucide-react';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useExpenseSummary } from '@/features/expenses/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseTable } from '@/features/expenses/components/ExpenseTable';
import { ExpenseDialog } from '@/features/expenses/components/ExpenseDialog';
import { DeleteExpenseDialog } from '@/features/expenses/components/DeleteExpenseDialog';
import { ExpenseCategoryChart } from '@/features/expenses/components/ExpenseCategoryChart';
import type { WeddingExpenseDto } from '@/features/expenses';
import { EXPENSE_CATEGORIES } from '@/features/expenses/utils/expenseCategory';

export function ExpensesPage() {
  const { t } = useTranslation(['expenses', 'auth', 'common', 'weddings']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const logout = useLogout();

  const weddingIdFromUrl = searchParams.get('weddingId');

  const { data: weddings, isLoading: weddingsLoading } = useWeddings({
    enabled: !weddingIdFromUrl,
  });

  const selectedWeddingId = weddingIdFromUrl || weddings?.[0]?.id || '';
  const {
    data: summary,
    isLoading: summaryLoading,
    error,
  } = useExpenseSummary(selectedWeddingId);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<WeddingExpenseDto | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<WeddingExpenseDto | null>(null);
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  const categoryTotals = useMemo(() => {
    if (!summary?.categoryTotals) return [];

    return Object.entries(summary.categoryTotals)
      .filter(([, value]) => value && value > 0)
      .map(([key, value]) => ({
        name: key,
        value: value || 0,
      }));
  }, [summary]);

  // Budget checklist - which categories have expenses
  const budgetChecklist = useMemo(() => {
    const activeCategories = new Set(categoryTotals.map((c) => c.name));

    return EXPENSE_CATEGORIES
      .filter((cat) => cat.value !== 6) // Exclude "Other" from checklist
      .map((cat) => {
        const categoryName = cat.labelKey.split('.').pop() || '';
        const capitalizedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        return {
          value: cat.value,
          labelKey: cat.labelKey,
          hasExpenses: activeCategories.has(capitalizedName),
        };
      });
  }, [categoryTotals]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (weddingsLoading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <p className="text-muted-foreground">{t('common:loading')}</p>
      </div>
    );
  }

  if (!weddingIdFromUrl && (!weddings || weddings.length === 0)) {
    return (
      <div className="min-h-screen bg-muted/40">
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold">{t('common:appName')}</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                {t('auth:logout')}
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="mb-4 text-muted-foreground">{t('weddings:noWeddings')}</p>
            <Button onClick={() => navigate('/dashboard')}>
              {t('weddings:createWedding')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">{t('common:appName')}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              {t('auth:logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">{t('expenses:title')}</h2>
            <p className="text-muted-foreground">{t('expenses:subtitle')}</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('expenses:addExpense')}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('expenses:summary.totalSpent')}
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryLoading ? '...' : formatCurrency(summary?.totalAmount || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary?.expenses?.length || 0} {t('expenses:title').toLowerCase()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('expenses:summary.title')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {categoryTotals.length > 0 ? (
                <div className="space-y-2">
                  {categoryTotals.slice(0, 3).map((cat) => (
                    <div key={cat.name} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t(`expenses:categories.${cat.name.toLowerCase()}`)}
                      </span>
                      <span className="font-medium">{formatCurrency(cat.value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t('expenses:noExpenses')}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('expenses:summary.checklist')}
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-1">
                {budgetChecklist.map((item) => (
                  <div key={item.value} className="flex items-center gap-2 text-sm">
                    {item.hasExpenses ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={item.hasExpenses ? 'text-foreground' : 'text-muted-foreground'}>
                      {t(item.labelKey)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('expenses:title')}</CardTitle>
            <CardDescription>
              {summary?.expenses?.length
                ? t('summary.expensesRecorded', { count: summary.expenses.length })
                : t('expenses:noExpensesDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">{t('common:loading')}</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-destructive">{t('common:error')}</p>
              </div>
            ) : !summary?.expenses?.length ? (
              <div className="p-8 text-center border border-dashed rounded-lg">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  {t('expenses:noExpensesDescription')}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('expenses:addExpense')}
                </Button>
              </div>
            ) : (
              <ExpenseTable
                expenses={summary.expenses}
                onEdit={setEditingExpense}
                onDelete={setDeletingExpense}
              />
            )}
          </CardContent>
        </Card>

        {/* Collapsible Category Chart */}
        {categoryTotals.length > 0 && (
          <Card>
            <CardHeader
              className="cursor-pointer select-none"
              onClick={() => setIsChartExpanded(!isChartExpanded)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{t('expenses:summary.byCategory')}</CardTitle>
                  <CardDescription>{t('expenses:subtitle')}</CardDescription>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                    isChartExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </CardHeader>
            {isChartExpanded && (
              <CardContent>
                <ExpenseCategoryChart data={categoryTotals} />
              </CardContent>
            )}
          </Card>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <ExpenseDialog
        weddingId={selectedWeddingId}
        expense={editingExpense}
        open={isAddDialogOpen || !!editingExpense}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingExpense(null);
          }
        }}
      />

      {/* Delete Dialog */}
      <DeleteExpenseDialog
        expense={deletingExpense}
        weddingId={selectedWeddingId}
        open={!!deletingExpense}
        onOpenChange={(open) => !open && setDeletingExpense(null)}
      />
    </div>
  );
}
