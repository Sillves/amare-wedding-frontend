import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sparkles, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import {
  useWebsite,
  useCreateWebsite,
  useUpdateWebsite,
} from '@/features/website/hooks/useWebsite';
import { getDefaultContent, getDefaultSettings } from '@/features/website/utils/defaultContent';
import { WebsiteEditor } from '@/features/website/components/WebsiteEditor';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { FontSizeSwitcher } from '@/shared/components/FontSizeSwitcher';

/**
 * Floating decorative elements for premium aesthetic
 */
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating hearts */}
      <div className="absolute top-[18%] left-[10%] animate-float-slow opacity-15">
        <Heart className="h-5 w-5 text-primary fill-primary" />
      </div>
      <div className="absolute top-[35%] right-[8%] animate-float-medium opacity-10">
        <Heart className="h-4 w-4 text-primary fill-primary" />
      </div>
      <div className="absolute bottom-[20%] left-[5%] animate-float-fast opacity-10">
        <Heart className="h-6 w-6 text-primary fill-primary" />
      </div>

      {/* Sparkles */}
      <div className="absolute top-[22%] right-[18%] animate-pulse-slow opacity-20">
        <Sparkles className="h-4 w-4 text-amber-400" />
      </div>
      <div className="absolute bottom-[35%] left-[15%] animate-pulse-medium opacity-15">
        <Sparkles className="h-3 w-3 text-amber-400" />
      </div>
    </div>
  );
}

export function WebsiteEditorPage() {
  const { t } = useTranslation(['website', 'common', 'auth']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isLoading: userLoading } = useCurrentUser();
  const createWebsite = useCreateWebsite();
  const updateWebsite = useUpdateWebsite();

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

  // Check if wedding has a valid date (not epoch/default)
  const hasValidWeddingDate = (() => {
    if (!selectedWedding?.date) return false;
    const date = new Date(selectedWedding.date);
    // Check if date is valid and not epoch (1970) or year 1
    return date.getFullYear() > 1970;
  })();

  const handleCreateWebsite = async () => {
    if (!selectedWeddingId || !selectedWedding) return;

    // Create the website with default template
    await createWebsite.mutateAsync({
      weddingId: selectedWeddingId,
      data: { template: 0 }, // 0 = ElegantClassic
    });

    // Get localized default content based on user's language
    const coupleNames = selectedWedding.title || '';
    const weddingDate = selectedWedding.date || new Date().toISOString();
    const weddingLocation = selectedWedding.location || '';

    // Use translation function with 'website' namespace
    const localizedContent = getDefaultContent(
      coupleNames,
      weddingDate,
      weddingLocation,
      (key: string) => t(`website:${key}`)
    );

    // Get default settings for the template (ensures consistent colors)
    const defaultSettings = getDefaultSettings(0); // 0 = ElegantClassic

    // Update the website with localized content and correct settings
    await updateWebsite.mutateAsync({
      weddingId: selectedWeddingId,
      data: { content: localizedContent, settings: defaultSettings },
    });
  };

  if (weddingsLoading || userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <Heart className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-serif">{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  if (!canAccessWebsite) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Animated background gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <FloatingElements />

        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2 ml-4 group">
              <Heart className="h-6 w-6 text-primary fill-primary transition-transform group-hover:scale-110" />
              <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto p-4 relative">
          <div className="max-w-md mx-auto mt-16 text-center animate-fade-in">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-serif font-semibold mb-4">{t('website:upgrade.title')}</h2>
            <p className="text-muted-foreground mb-8">
              {t('website:upgrade.description')}
            </p>
            <Button
              onClick={() => navigate('/pricing')}
              className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {t('website:upgrade.viewPlans')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!weddings || weddings.length === 0) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Animated background gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <FloatingElements />

        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2 ml-4 group">
              <Heart className="h-6 w-6 text-primary fill-primary transition-transform group-hover:scale-110" />
              <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto p-4 relative">
          <div className="max-w-md mx-auto mt-16 text-center animate-fade-in">
            <div className="p-4 rounded-full bg-muted/30 w-fit mx-auto mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-serif font-semibold mb-4">{t('website:noWedding.title')}</h2>
            <p className="text-muted-foreground mb-8">
              {t('website:noWedding.description')}
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow"
            >
              {t('website:noWedding.createWedding')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // No website exists yet - show create prompt or date required message
  if (websiteError || (!websiteLoading && !website)) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Animated background gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        <FloatingElements />

        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2 ml-4 group">
              <Heart className="h-6 w-6 text-primary fill-primary transition-transform group-hover:scale-110" />
              <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto p-4 relative">
          {!hasValidWeddingDate ? (
            <div className="max-w-md mx-auto mt-16 text-center animate-fade-in">
              <div className="p-4 rounded-full bg-amber-500/10 w-fit mx-auto mb-6">
                <Calendar className="h-12 w-12 text-amber-600" />
              </div>
              <h2 className="text-3xl font-serif font-semibold mb-4">{t('website:dateRequired.title')}</h2>
              <p className="text-muted-foreground mb-8">
                {t('website:dateRequired.description')}
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('website:dateRequired.button')}
              </Button>
            </div>
          ) : (
            <div className="max-w-md mx-auto mt-16 text-center animate-fade-in">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6 animate-pulse">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-3xl font-serif font-semibold mb-4">{t('website:create.title')}</h2>
              <p className="text-muted-foreground mb-8">
                {t('website:create.description')}
              </p>
              <Button
                onClick={handleCreateWebsite}
                disabled={createWebsite.isPending || updateWebsite.isPending}
                className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {(createWebsite.isPending || updateWebsite.isPending)
                  ? t('website:create.creating')
                  : t('website:create.button')}
              </Button>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (websiteLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <Heart className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-serif">{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header for editor view */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
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
              <span className="text-2xl font-script text-primary hidden sm:inline">{t('common:appName')}</span>
            </Link>
            <div className="hidden md:block border-l border-border/50 pl-4">
              <p className="text-sm font-medium">{selectedWedding?.title}</p>
              <p className="text-xs text-muted-foreground">{t('website:title')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <FontSizeSwitcher />
              <ThemeSwitcher />
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
