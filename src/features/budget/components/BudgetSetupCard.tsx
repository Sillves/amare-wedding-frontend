import { useTranslation } from 'react-i18next';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BudgetSetupCardProps {
  onSetupClick: () => void;
}

export function BudgetSetupCard({ onSetupClick }: BudgetSetupCardProps) {
  const { t } = useTranslation(['expenses']);

  return (
    <Card className="rounded-2xl border-border/50 border-dashed bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-2">
          <Target className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-serif text-xl">
          {t('expenses:budget.setupTitle')}
        </CardTitle>
        <CardDescription>
          {t('expenses:budget.setupDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button
          onClick={onSetupClick}
          className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow"
        >
          {t('expenses:budget.getStarted')}
        </Button>
      </CardContent>
    </Card>
  );
}
