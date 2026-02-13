import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInvitationByToken, useAcceptInvitation } from '@/features/invitations/hooks/useInvitations';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: invitation, isLoading, error } = useInvitationByToken(token ?? '');
  const acceptMutation = useAcceptInvitation();

  const handleAccept = async () => {
    if (!token) return;
    if (!isAuthenticated) {
      localStorage.setItem('pendingInviteToken', token);
      navigate('/login');
      return;
    }
    await acceptMutation.mutateAsync(token);
    navigate('/planner');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">{t('common:planner.inviteExpired')}</p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              {t('common:planner.goHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Heart className="h-10 w-10 text-primary mx-auto mb-2" />
          <CardTitle>{t('common:planner.youreInvited')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            {t('common:planner.inviteDescription')}
          </p>
          <Button
            className="w-full"
            onClick={handleAccept}
            disabled={acceptMutation.isPending}
          >
            {acceptMutation.isPending
              ? t('common:loading')
              : isAuthenticated
                ? t('common:planner.acceptInvitation')
                : t('common:planner.loginToAccept')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
