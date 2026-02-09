import { useState, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Wallet,
  TrendingUp,
  CheckCircle2,
  Circle,
  ClipboardList,
  ChevronDown,
  Heart,
  Sparkles,
  Settings2,
} from 'lucide-react';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useExpenseSummary } from '@/features/expenses/hooks/useExpenses';
import { useBudget } from '@/features/budget/hooks/useBudget';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseTable } from '@/features/expenses/components/ExpenseTable';
import { ExpenseDialog } from '@/features/expenses/components/ExpenseDialog';
import { DeleteExpenseDialog } from '@/features/expenses/components/DeleteExpenseDialog';
import { ExpenseCategoryChart } from '@/features/expenses/components/ExpenseCategoryChart';
import { BudgetSetupCard } from '@/features/budget/components/BudgetSetupCard';
import { BudgetDialog } from '@/features/budget/components/BudgetDialog';
import { BudgetOverviewCard } from '@/features/budget/components/BudgetOverviewCard';
import { BudgetCategoryBreakdown } from '@/features/budget/components/BudgetCategoryBreakdown';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { FontSizeSwitcher } from '@/shared/components/FontSizeSwitcher';
import type { WeddingExpenseDto } from '@/features/expenses';
import { EXPENSE_CATEGORIES } from '@/features/expenses/utils/expenseCategory';

/**
 * Floating decorative elements for premium aesthetic
 */
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating hearts */}
      <div className="absolute top-[15%] left-[8%] animate-float-slow opacity-15">
        <Heart className="h-5 w-5 text-primary fill-primary" />
      </div>
      <div className="absolute top-[25%] right-[5%] animate-float-medium opacity-10">
        <Heart className="h-4 w-4 text-primary fill-primary" />
      </div>
      <div className="absolute bottom-[30%] left-[15%] animate-float-fast opacity-10">
        <Heart className="h-6 w-6 text-primary fill-primary" />
      </div>

      {/* Sparkles */}
      <div className="absolute top-[20%] right-[15%] animate-pulse-slow opacity-20">
        <Sparkles className="h-4 w-4 text-amber-400" />
      </div>
      <div className="absolute bottom-[25%] left-[20%] animate-pulse-medium opacity-15">
        <Sparkles className="h-3 w-3 text-amber-400" />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-[35%] right-[3%] animate-spin-very-slow opacity-10">
        <div className="w-10 h-10 rounded-full border-2 border-primary" />
      </div>
    </div>
  );
}

/**
 * Mini carousel that shows one card at a time with dot navigation
 */
function SummaryCarousel({ children }: { children: ReactNode[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cards = children.filter(Boolean);

  if (cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <div className="h-[200px] overflow-hidden [&>*]:h-full [&>*]:flex [&>*]:flex-col">{cards[activeIndex]}</div>
      {cards.length > 1 && (
        <div className="flex justify-center gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="p-1.5 group"
              aria-label={`Card ${i + 1}`}
            >
              <span
                className={`block h-2.5 rounded-full transition-all duration-200 ${
                  i === activeIndex
                    ? 'w-7 bg-primary'
                    : 'w-3 bg-muted-foreground/30 group-hover:bg-muted-foreground/50'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

  const { data: budget, isLoading: budgetLoading } = useBudget(selectedWeddingId);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<WeddingExpenseDto | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<WeddingExpenseDto | null>(null);
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  const hasBudget = !!budget && !!budget.totalBudget && budget.totalBudget > 0;

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

  // Build categoryTotals as a record for the breakdown component
  const categoryTotalsRecord = useMemo(() => {
    if (!summary?.categoryTotals) return {};
    return summary.categoryTotals as Record<string, number>;
  }, [summary]);

  if (weddingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <Heart className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-serif">{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  if (!weddingIdFromUrl && (!weddings || weddings.length === 0)) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <Heart className="h-6 w-6 text-primary fill-primary transition-transform group-hover:scale-110" />
              <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout} className="rounded-xl">
                {t('auth:logout')}
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 relative">
          <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center bg-card/80 backdrop-blur-sm">
            <p className="mb-4 text-muted-foreground">{t('weddings:noWeddings')}</p>
            <Button onClick={() => navigate('/dashboard')} className="rounded-xl shadow-lg shadow-primary/25">
              {t('weddings:createWedding')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background relative flex flex-col overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <FloatingElements />

      {/* Premium Header */}
      <header className="flex-shrink-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <Heart className="h-6 w-6 text-primary fill-primary transition-transform group-hover:scale-110" />
              <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <FontSizeSwitcher />
              <ThemeSwitcher />
            </div>
            <span className="hidden md:inline text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout} className="rounded-xl">
              {t('auth:logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col container mx-auto px-4 py-4 gap-4 relative">
        {/* Header with title and actions */}
        <section className="flex-shrink-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-semibold">{t('expenses:title')}</h1>
            <p className="text-muted-foreground text-sm">{t('expenses:subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            {hasBudget && (
              <Button
                variant="outline"
                onClick={() => setIsBudgetDialogOpen(true)}
                className="rounded-xl"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                {t('expenses:budget.editBudget')}
              </Button>
            )}
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('expenses:addExpense')}
            </Button>
          </div>
        </section>

        {/* Budget Setup Card (shown when no budget exists) */}
        {!budgetLoading && !hasBudget && (
          <section className="flex-shrink-0 animate-fade-in-up animation-delay-100">
            <BudgetSetupCard onSetupClick={() => setIsBudgetDialogOpen(true)} />
          </section>
        )}

        {/* Budget Category Breakdown + Expenses Table side by side when budget exists */}
        {hasBudget ? (
          <section className="flex-1 min-h-0 grid gap-4 lg:grid-cols-[1fr_2fr] animate-fade-in-up animation-delay-200">
            {/* Left panel: Summary Carousel + Category Breakdown */}
            <div className="flex flex-col gap-4 min-h-0">
              <SummaryCarousel>
                {[
                  <BudgetOverviewCard
                    key="budget-overview"
                    budget={budget!}
                    totalSpent={summary?.totalAmount || 0}
                  />,
                  <Card key="category-summary" className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t('expenses:summary.title')}
                      </CardTitle>
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
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
                  </Card>,
                  <Card key="budget-checklist" className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t('expenses:summary.checklist')}
                      </CardTitle>
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <ClipboardList className="h-4 w-4 text-amber-600" />
                      </div>
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
                  </Card>,
                ]}
              </SummaryCarousel>
              <BudgetCategoryBreakdown
                budget={budget!}
                categoryTotals={categoryTotalsRecord}
                onEditClick={() => setIsBudgetDialogOpen(true)}
                className="flex-1"
              />
            </div>

            {/* Right panel: Expenses Table */}
            <Card className="rounded-2xl border-border/50 shadow-lg bg-card/80 backdrop-blur-sm flex flex-col min-h-0">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="font-serif text-xl">{t('expenses:title')}</CardTitle>
                <CardDescription>
                  {summary?.expenses?.length
                    ? t('summary.expensesRecorded', { count: summary.expenses.length })
                    : t('expenses:noExpensesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 flex flex-col">
                {summaryLoading ? (
                  <div className="p-8 text-center">
                    <Heart className="h-8 w-8 text-primary mx-auto animate-pulse mb-4" />
                    <p className="text-muted-foreground">{t('common:loading')}</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <p className="text-destructive">{t('common:error')}</p>
                  </div>
                ) : !summary?.expenses?.length ? (
                  <div className="p-8 text-center border border-dashed border-border/50 rounded-xl">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      {t('expenses:noExpensesDescription')}
                    </p>
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="rounded-xl shadow-lg shadow-primary/25"
                    >
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
          </section>
        ) : (
          <section className="flex-1 min-h-0 flex flex-col gap-4 animate-fade-in-up animation-delay-400">
            <Card className="rounded-2xl border-border/50 shadow-lg bg-card/80 backdrop-blur-sm flex flex-col min-h-0 flex-1">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="font-serif text-xl">{t('expenses:title')}</CardTitle>
                <CardDescription>
                  {summary?.expenses?.length
                    ? t('summary.expensesRecorded', { count: summary.expenses.length })
                    : t('expenses:noExpensesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 flex flex-col">
                {summaryLoading ? (
                  <div className="p-8 text-center">
                    <Heart className="h-8 w-8 text-primary mx-auto animate-pulse mb-4" />
                    <p className="text-muted-foreground">{t('common:loading')}</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <p className="text-destructive">{t('common:error')}</p>
                  </div>
                ) : !summary?.expenses?.length ? (
                  <div className="p-8 text-center border border-dashed border-border/50 rounded-xl">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      {t('expenses:noExpensesDescription')}
                    </p>
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="rounded-xl shadow-lg shadow-primary/25"
                    >
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

            {/* Collapsible Category Chart (when no budget, preserve original behavior) */}
            {categoryTotals.length > 0 && (
              <Card className="rounded-2xl border-border/50 shadow-lg bg-card/80 backdrop-blur-sm flex-shrink-0">
                <CardHeader
                  className="cursor-pointer select-none hover:bg-muted/30 rounded-t-2xl transition-colors"
                  onClick={() => setIsChartExpanded(!isChartExpanded)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-serif text-xl">{t('expenses:summary.byCategory')}</CardTitle>
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
          </section>
        )}
      </main>

      {/* Add/Edit Expense Dialog */}
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

      {/* Delete Expense Dialog */}
      <DeleteExpenseDialog
        expense={deletingExpense}
        weddingId={selectedWeddingId}
        open={!!deletingExpense}
        onOpenChange={(open) => !open && setDeletingExpense(null)}
      />

      {/* Budget Dialog */}
      <BudgetDialog
        weddingId={selectedWeddingId}
        budget={budget}
        open={isBudgetDialogOpen}
        onOpenChange={setIsBudgetDialogOpen}
      />
    </div>
  );
}
