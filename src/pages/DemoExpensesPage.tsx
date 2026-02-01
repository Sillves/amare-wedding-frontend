import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Wallet, TrendingUp, CheckCircle2, Circle, ClipboardList, ChevronDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseTable } from '@/features/expenses/components/ExpenseTable';
import { ExpenseCategoryChart } from '@/features/expenses/components/ExpenseCategoryChart';
import { DemoProvider, useDemoContext } from '@/features/demo/context/DemoContext';
import { DemoBanner } from '@/features/demo/components/DemoBanner';
import { DemoExpenseDialog, DemoDeleteExpenseDialog } from '@/features/demo/components/DemoExpenseDialogs';
import { EXPENSE_CATEGORIES } from '@/features/expenses/utils/expenseCategory';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import type { WeddingExpenseDto } from '@/features/expenses/api/expensesApi';

function DemoExpensesContent() {
  const { t } = useTranslation(['expenses', 'common', 'demo', 'guests', 'events', 'website']);
  const navigate = useNavigate();
  const { expenseSummary } = useDemoContext();

  const [isChartExpanded, setIsChartExpanded] = useState(false);

  // Dialog states
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<WeddingExpenseDto | null>(null);

  const categoryTotals = useMemo(() => {
    if (!expenseSummary?.categoryTotals) return [];

    return Object.entries(expenseSummary.categoryTotals)
      .filter(([, value]) => value && value > 0)
      .map(([key, value]) => ({
        name: key,
        value: value || 0,
      }));
  }, [expenseSummary]);

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

  const handleCreate = () => {
    setSelectedExpense(null);
    setExpenseDialogOpen(true);
  };

  const handleEdit = (expense: WeddingExpenseDto) => {
    setSelectedExpense(expense);
    setExpenseDialogOpen(true);
  };

  const handleDelete = (expense: WeddingExpenseDto) => {
    setSelectedExpense(expense);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-muted/40 overflow-x-hidden">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">{t('common:appName')}</span>
            <Badge variant="secondary" className="ml-2">
              Demo
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1 sm:gap-3">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            <Button variant="outline" size="sm" className="px-2 sm:px-4" onClick={() => navigate('/')}>
              {t('demo:exitDemo')}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto">
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo')}>
              {t('common:dashboard.title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/guests')}>
              {t('guests:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/events')}>
              {t('events:title')}
            </Button>
            <Button
              variant="ghost"
              className="rounded-none border-b-2 border-primary"
              onClick={() => navigate('/demo/expenses')}
            >
              {t('expenses:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/website')}>
              {t('website:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/rsvp')}>
              RSVP
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 space-y-6">
        {/* Demo Banner */}
        <DemoBanner />

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">{t('expenses:title')}</h2>
            <p className="text-muted-foreground">{t('expenses:subtitle')}</p>
          </div>
          <Button onClick={handleCreate}>
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
                {formatCurrency(expenseSummary?.totalAmount || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {expenseSummary?.expenses?.length || 0} {t('expenses:title').toLowerCase()}
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
              {expenseSummary?.expenses?.length
                ? t('summary.expensesRecorded', { count: expenseSummary.expenses.length })
                : t('expenses:noExpensesDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseTable
              expenses={expenseSummary?.expenses || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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

      {/* Dialogs */}
      <DemoExpenseDialog
        expense={selectedExpense}
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
      />
      <DemoDeleteExpenseDialog
        expense={selectedExpense}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}

export function DemoExpensesPage() {
  return (
    <DemoProvider>
      <DemoExpensesContent />
    </DemoProvider>
  );
}
