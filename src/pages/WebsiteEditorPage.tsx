import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import {
  useWebsite,
  useCreateWebsite,
} from '@/features/website/hooks/useWebsite';
import { WebsiteEditor } from '@/features/website/components/WebsiteEditor';

export function WebsiteEditorPage() {
  const { t } = useTranslation(['website', 'common']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isLoading: userLoading } = useCurrentUser();
  const createWebsite = useCreateWebsite();

  const weddingIdFromUrl = searchParams.get('weddingId');
  const { data: weddings, isLoading: weddingsLoading } = useWeddings();

  const selectedWeddingId = weddingIdFromUrl || weddings?.[0]?.id || '';
  const selectedWedding = weddings?.find((w) => w.id === selectedWeddingId);

  const {
    data: website,
    isLoading: websiteLoading,
    error: websiteError,
  } = useWebsite(selectedWeddingId, { enabled: !!selectedWeddingId });

  // Check subscription tier (0=Free, 1=Starter, 2=Pro)
  const canAccessWebsite =
    user?.subscriptionTier === 1 || user?.subscriptionTier === 2;

  const handleCreateWebsite = async () => {
    if (!selectedWeddingId) return;
    await createWebsite.mutateAsync({
      weddingId: selectedWeddingId,
      data: { template: 0 }, // 0 = ElegantClassic
    });
  };

  if (weddingsLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t('common:loading')}</p>
      </div>
    );
  }

  if (!canAccessWebsite) {
    return (
      <div className="min-h-screen bg-muted/40">
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-4 text-xl font-bold">{t('common:appName')}</h1>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <div className="max-w-md mx-auto mt-16 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('website:upgrade.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('website:upgrade.description')}
            </p>
            <Button onClick={() => navigate('/pricing')}>
              {t('website:upgrade.viewPlans')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!weddings || weddings.length === 0) {
    return (
      <div className="min-h-screen bg-muted/40">
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-4 text-xl font-bold">{t('common:appName')}</h1>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <div className="max-w-md mx-auto mt-16 text-center">
            <h2 className="text-2xl font-bold mb-2">{t('website:noWedding.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('website:noWedding.description')}
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              {t('website:noWedding.createWedding')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // No website exists yet - show create prompt
  if (websiteError || (!websiteLoading && !website)) {
    return (
      <div className="min-h-screen bg-muted/40">
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-4 text-xl font-bold">{t('common:appName')}</h1>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <div className="max-w-md mx-auto mt-16 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('website:create.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('website:create.description')}
            </p>
            <Button
              onClick={handleCreateWebsite}
              disabled={createWebsite.isPending}
            >
              {createWebsite.isPending
                ? t('website:create.creating')
                : t('website:create.button')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (websiteLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t('common:loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold">{t('common:appName')}</h1>
              <p className="text-sm text-muted-foreground">
                {selectedWedding?.title}
              </p>
            </div>
          </div>
        </div>
      </header>

      <WebsiteEditor
        weddingId={selectedWeddingId}
        weddingSlug={selectedWedding?.slug || ''}
      />
    </div>
  );
}
