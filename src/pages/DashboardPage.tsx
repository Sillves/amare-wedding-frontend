import { useTranslation } from 'react-i18next';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { Button } from '@/components/ui/button';
import { WeddingList } from '@/features/weddings/components/WeddingList';
import { CreateWeddingDialog } from '@/features/weddings/components/CreateWeddingDialog';

export function DashboardPage() {
  const { t } = useTranslation(['weddings', 'auth', 'common']);
  const { user } = useAuth();
  const logout = useLogout();
  const { data: weddings, isLoading } = useWeddings();

  const hasWeddings = weddings && weddings.length > 0;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">{t('common:appName')}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              {t('auth:logout')}
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{t('weddings:myWeddings')}</h2>
            <p className="text-muted-foreground">
              {hasWeddings
                ? t('weddings:noWeddingsDescription')
                : t('weddings:noWeddingsDescription')}
            </p>
          </div>
          <CreateWeddingDialog>
            <Button>{t('weddings:createWedding')}</Button>
          </CreateWeddingDialog>
        </div>

        {!isLoading && !hasWeddings ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="mb-4 text-muted-foreground">{t('weddings:noWeddings')}</p>
            <CreateWeddingDialog>
              <Button>{t('weddings:createWedding')}</Button>
            </CreateWeddingDialog>
          </div>
        ) : (
          <WeddingList />
        )}
      </main>
    </div>
  );
}
