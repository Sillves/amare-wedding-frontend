import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useLogout, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { Calendar, MapPin, Users, Eye, Edit } from 'lucide-react';
import type { WeddingWithRoleDto } from '@/features/invitations/types';

export function PlannerPage() {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const logout = useLogout();
  useCurrentUser();
  const { data: weddings, isLoading } = useWeddings();

  const sharedWeddings = weddings?.filter(w => w.role === 1) ?? [];
  const ownedWeddings = weddings?.filter(w => w.role === 0) ?? [];

  const getAccessLabel = (wedding: WeddingWithRoleDto) => {
    if (wedding.isReadOnly) return t('common:planner.viewOnly');
    if (wedding.canAccessGuests && wedding.canAccessEvents &&
        wedding.canAccessExpenses && wedding.canAccessWebsite) {
      return t('common:planner.fullAccess');
    }
    return t('common:planner.customAccess');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">{t('common:planner.myWeddings')}</h1>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            {ownedWeddings.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                {t('common:planner.myWedding')}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={logout}>
              {t('auth:logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : sharedWeddings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">{t('common:planner.noWeddings')}</p>
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
    </div>
  );
}
