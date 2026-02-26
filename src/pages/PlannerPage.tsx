import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useAuth, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Eye, Edit, Heart, Briefcase } from 'lucide-react';
import type { WeddingWithRoleDto } from '@/features/invitations/types';
import { PlannerLayout } from '@/layouts/PlannerLayout';

export function PlannerPage() {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const { user } = useAuth();
  useCurrentUser();
  const { data: weddings, isLoading } = useWeddings();

  if (user?.accountType !== 1) {
    return <Navigate to="/dashboard" replace />;
  }

  const sharedWeddings = weddings?.filter(w => w.role === 1) ?? [];

  const getAccessLabel = (wedding: WeddingWithRoleDto) => {
    if (wedding.isReadOnly) return t('common:planner.viewOnly');
    if (wedding.canAccessGuests && wedding.canAccessEvents &&
        wedding.canAccessExpenses && wedding.canAccessWebsite) {
      return t('common:planner.fullAccess');
    }
    return t('common:planner.customAccess');
  };

  return (
    <PlannerLayout>
      <main className="max-w-5xl mx-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : sharedWeddings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 space-y-4">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{t('common:planner.welcome')}</h2>
                <p className="text-muted-foreground max-w-md mx-auto">{t('common:planner.getStarted')}</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/onboarding')}>
                <Heart className="h-4 w-4 mr-2" />
                {t('common:planner.createMyWedding')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          sharedWeddings.map(wedding => (
            <Card
              key={wedding.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => navigate(`/dashboard?wedding=${wedding.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{wedding.title}</CardTitle>
                  <Badge variant={wedding.isReadOnly ? 'secondary' : 'default'}>
                    {wedding.isReadOnly ? <Eye className="h-3 w-3 mr-1" /> : <Edit className="h-3 w-3 mr-1" />}
                    {getAccessLabel(wedding)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {wedding.date ? new Date(wedding.date).toLocaleDateString() : '-'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {wedding.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {wedding.guestCount} {t('common:guests')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </PlannerLayout>
  );
}
