import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, UserCheck, UserX, Clock } from 'lucide-react';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useGuests } from '@/features/guests/hooks/useGuests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GuestTable } from '@/features/guests/components/GuestTable';
import { CreateGuestDialog } from '@/features/guests/components/CreateGuestDialog';
import { EditGuestDialog } from '@/features/guests/components/EditGuestDialog';
import { DeleteGuestDialog } from '@/features/guests/components/DeleteGuestDialog';
import type { GuestDto } from '@/features/weddings/types';

export function GuestsPage() {
  const { t } = useTranslation(['guests', 'auth', 'common', 'weddings']);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const logout = useLogout();

  const { data: weddings, isLoading: weddingsLoading } = useWeddings();

  // Get wedding ID from URL params or use first wedding
  const selectedWeddingId = searchParams.get('weddingId') || weddings?.[0]?.id || '';
  const { data: guests, isLoading: guestsLoading, error } = useGuests(selectedWeddingId);

  const [editingGuest, setEditingGuest] = useState<GuestDto | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<GuestDto | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!guests) return { total: 0, attending: 0, declined: 0, pending: 0, maybe: 0 };

    return {
      total: guests.length,
      attending: guests.filter((g) => g.rsvpStatus === 1).length,
      declined: guests.filter((g) => g.rsvpStatus === 2).length,
      pending: guests.filter((g) => g.rsvpStatus === 0).length,
      maybe: guests.filter((g) => g.rsvpStatus === 3).length,
    };
  }, [guests]);

  const handleWeddingChange = (weddingId: string) => {
    setSearchParams({ weddingId });
  };

  const selectedWedding = weddings?.find((w) => w.id === selectedWeddingId);

  if (weddingsLoading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <p className="text-muted-foreground">{t('common:loading')}</p>
      </div>
    );
  }

  if (!weddings || weddings.length === 0) {
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
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="mb-4 text-muted-foreground">{t('weddings:noWeddings')}</p>
            <Button onClick={() => navigate('/dashboard')}>{t('weddings:createWedding')}</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">{t('common:appName')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              {t('auth:logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Header with wedding selector */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">{t('guests:title')}</h2>
            <p className="text-muted-foreground">{t('guests:manageDescription')}</p>
          </div>
          <div className="flex items-center gap-2">
            {weddings.length > 1 && (
              <Select value={selectedWeddingId} onValueChange={handleWeddingChange}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder={t('weddings:selectWedding')} />
                </SelectTrigger>
                <SelectContent>
                  {weddings.map((wedding) => (
                    <SelectItem key={wedding.id} value={wedding.id}>
                      {wedding.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <CreateGuestDialog weddingId={selectedWeddingId}>
              <Button>{t('guests:addGuest')}</Button>
            </CreateGuestDialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:totalGuests')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">{t('guests:stats.allGuests')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:attending')}</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.attending}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.attending / stats.total) * 100) : 0}%{' '}
                {t('guests:stats.confirmed')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:declined')}</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.declined / stats.total) * 100) : 0}%{' '}
                {t('guests:stats.declined')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:pending')}</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%{' '}
                {t('guests:stats.pending')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:maybe')}</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.maybe}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.maybe / stats.total) * 100) : 0}%{' '}
                {t('guests:stats.maybe')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Guests Table */}
        {selectedWedding && (
          <Card>
            <CardHeader>
              <CardTitle>{t('guests:guestList')}</CardTitle>
              <CardDescription>
                {t('guests:guestListDescription', { wedding: selectedWedding.title })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {guestsLoading ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">{t('common:loading')}</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-destructive">{t('common:error')}</p>
                </div>
              ) : (
                <GuestTable
                  guests={guests || []}
                  onEdit={setEditingGuest}
                  onDelete={setDeletingGuest}
                />
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Edit Dialog */}
      <EditGuestDialog
        guest={editingGuest}
        open={!!editingGuest}
        onOpenChange={(open) => !open && setEditingGuest(null)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteGuestDialog
        guest={deletingGuest}
        open={!!deletingGuest}
        onOpenChange={(open) => !open && setDeletingGuest(null)}
      />
    </div>
  );
}
