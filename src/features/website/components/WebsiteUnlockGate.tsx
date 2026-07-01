import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUnlockRsvpFlow } from '@/features/rsvp/hooks/useRsvpFlow';

interface WebsiteUnlockGateProps {
  slug: string;
}

/**
 * Passcode gate shown before a locked wedding website. On success the server sets the signed
 * rsvp_flow cookie; we invalidate the public-website query so the page refetches and renders
 * the personalised site. Reuses the RSVP unlock endpoint — one code opens both site and RSVP.
 */
export function WebsiteUnlockGate({ slug }: WebsiteUnlockGateProps) {
  const { t } = useTranslation('website');
  const queryClient = useQueryClient();
  const unlock = useUnlockRsvpFlow(slug);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await unlock.mutateAsync(passcode.trim());
      await queryClient.invalidateQueries({ queryKey: ['public-website', slug] });
    } catch {
      setError(t('publicGate.error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <Lock className="h-8 w-8 text-rose-600" />
          </div>
          <CardTitle className="text-2xl font-serif">{t('publicGate.title')}</CardTitle>
          <CardDescription>{t('publicGate.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={t('publicGate.placeholder')}
              autoFocus
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={unlock.isPending || !passcode.trim()}
            >
              {unlock.isPending ? t('publicGate.submitting') : t('publicGate.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
