import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Check, X, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubmitRsvp, useWeddingPublicInfo } from '@/features/rsvp/hooks/useRsvp';
import type { RsvpStatus } from '@/features/weddings/types';

export function RsvpPage() {
  const { weddingId } = useParams<{ weddingId: string }>();
  const { t, i18n } = useTranslation(['guests', 'common']);

  // Fetch wedding public information from API
  const { data: wedding, isLoading: weddingLoading, error: weddingError } = useWeddingPublicInfo(weddingId || '');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RsvpStatus | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitRsvp = useSubmitRsvp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wedding?.id || !name.trim() || selectedStatus === null) {
      return;
    }

    setErrorMessage(null);

    try {
      await submitRsvp.mutateAsync({
        weddingId: wedding.id, // Use the UUID from fetched wedding data, not the URL param (which could be a slug)
        data: {
          name: name.trim(),
          email: email.trim() || null,
          rsvpStatus: selectedStatus,
        },
      });
      setSubmitted(true);
    } catch (error: any) {
      console.error('Failed to submit RSVP:', error);

      // Check for specific error messages
      const errorResponse = error?.response?.data?.error;
      if (errorResponse === 'Guest not found for wedding') {
        setErrorMessage(t('guests:rsvp.guestNotFound'));
      } else {
        setErrorMessage(t('guests:rsvp.error'));
      }
    }
  };

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

  // Loading state
  if (weddingLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-rose-600" />
            <p className="mt-4 text-muted-foreground">{t('common:loading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error or not found
  if (!weddingId || weddingError || !wedding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">{t('common:error')}</CardTitle>
            <CardDescription>{t('guests:rsvp.notFound')}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
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
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('guests:rsvp.emailConfirmation')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <Heart className="h-8 w-8 text-rose-600" />
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
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-green-300 hover:bg-green-50 ${
                    selectedStatus === 1
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-200'
                  }`}
                >
                  <Check className="h-6 w-6 text-green-600" />
                  <span className="font-medium">{t('guests:rsvpStatus.attending')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus(2)}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-red-300 hover:bg-red-50 ${
                    selectedStatus === 2
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                      : 'border-gray-200'
                  }`}
                >
                  <X className="h-6 w-6 text-red-600" />
                  <span className="font-medium">{t('guests:rsvpStatus.declined')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus(3)}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 ${
                    selectedStatus === 3
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200'
                  }`}
                >
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                  <span className="font-medium">{t('guests:rsvpStatus.maybe')}</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitRsvp.isPending || !name.trim() || selectedStatus === null}
            >
              {submitRsvp.isPending ? t('guests:rsvp.submitting') : t('guests:rsvp.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
