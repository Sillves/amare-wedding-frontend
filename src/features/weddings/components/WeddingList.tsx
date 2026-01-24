import { useTranslation } from 'react-i18next';
import { useWeddings } from '../hooks/useWeddings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function WeddingList() {
  const { t } = useTranslation('weddings');
  const { data: weddings, isLoading, error } = useWeddings();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3 mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">{t('error')}</p>
      </div>
    );
  }

  if (!weddings || weddings.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {weddings.map((wedding) => (
        <Card key={wedding.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{wedding.title}</CardTitle>
            <CardDescription>
              {new Date(wedding.date).toLocaleDateString('nl-BE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{wedding.location}</p>
            {wedding.guestCount !== undefined && (
              <p className="text-sm font-medium mt-2">
                {wedding.guestCount} {t('details.guests').toLowerCase()}
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                {t('actions.view')}
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                {t('actions.manageGuests')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
