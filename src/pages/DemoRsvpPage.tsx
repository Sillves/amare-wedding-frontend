import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Check, X, HelpCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DemoProvider, useDemoContext } from '@/features/demo/context/DemoContext';
import { DemoBanner } from '@/features/demo/components/DemoBanner';
import { DEMO_WEDDING } from '@/features/demo/data/mockWedding';
import type { RsvpStatus } from '@/features/weddings/types';

function DemoRsvpContent() {
  const { t, i18n } = useTranslation(['guests', 'common', 'demo']);
  const navigate = useNavigate();
  const { addGuest } = useDemoContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RsvpStatus | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wedding = DEMO_WEDDING;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(i18n.language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || selectedStatus === null) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    addGuest({
      name: name.trim(),
      email: email.trim() || null,
      rsvpStatus: selectedStatus,
      preferredLanguage: i18n.language,
    });

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Button variant="ghost" onClick={() => navigate('/demo')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('demo:exitDemo')}
            </Button>
            <Badge variant="secondary">Demo</Badge>
          </div>
        </header>

        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">{t('guests:rsvp.thankyou')}</CardTitle>
              <CardDescription className="text-base">
                {selectedStatus === 1
                  ? t('guests:rsvp.confirmAttending')
                  : selectedStatus === 2
                    ? t('guests:rsvp.confirmDeclined')
                    : t('guests:rsvp.confirmMaybe')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DemoBanner />
              <p className="text-sm text-muted-foreground">{t('guests:rsvp.emailConfirmation')}</p>
              <Button variant="outline" onClick={() => navigate('/demo/guests')}>
                View Guest List
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" onClick={() => navigate('/demo')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('demo:exitDemo')}
          </Button>
          <Badge variant="secondary">Demo</Badge>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <DemoBanner className="text-left" />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900">
              <Heart className="h-8 w-8 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <CardTitle className="text-3xl font-serif mb-2">{wedding.title}</CardTitle>
              <p className="text-lg text-muted-foreground">{formatDate(wedding.date)}</p>
              {wedding.location && (
                <p className="text-sm text-muted-foreground mt-1">{wedding.location}</p>
              )}
            </div>
            <CardDescription className="text-base">
              {t('guests:rsvp.description')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="rsvp-name">
                  {t('guests:form.name')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="rsvp-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('guests:form.namePlaceholder')}
                  required
                  autoComplete="name"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="rsvp-email">{t('guests:form.email')}</Label>
                <Input
                  id="rsvp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('guests:form.emailPlaceholder')}
                  autoComplete="email"
                />
              </div>

              {/* RSVP Status Selection */}
              <div className="space-y-3">
                <Label>{t('guests:rsvp.statusQuestion')}</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setSelectedStatus(1)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950 ${
                      selectedStatus === 1
                        ? 'border-green-500 bg-green-50 dark:bg-green-950 ring-2 ring-green-200 dark:ring-green-800'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Check className="h-6 w-6 text-green-600" />
                    <span className="font-medium">{t('guests:rsvpStatus.attending')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStatus(2)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950 ${
                      selectedStatus === 2
                        ? 'border-red-500 bg-red-50 dark:bg-red-950 ring-2 ring-red-200 dark:ring-red-800'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <X className="h-6 w-6 text-red-600" />
                    <span className="font-medium">{t('guests:rsvpStatus.declined')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStatus(3)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 ${
                      selectedStatus === 3
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                    <span className="font-medium">{t('guests:rsvpStatus.maybe')}</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || !name.trim() || selectedStatus === null}
              >
                {isSubmitting ? t('guests:rsvp.submitting') : t('guests:rsvp.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DemoRsvpPage() {
  return (
    <DemoProvider>
      <DemoRsvpContent />
    </DemoProvider>
  );
}
