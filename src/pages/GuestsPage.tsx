import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, UserCheck, UserX, Clock, X } from 'lucide-react';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useGuests, useSendGuestInvitations } from '@/features/guests/hooks/useGuests';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestTable } from '@/features/guests/components/GuestTable';
import { CreateGuestDialog } from '@/features/guests/components/CreateGuestDialog';
import { EditGuestDialog } from '@/features/guests/components/EditGuestDialog';
import { DeleteGuestDialog } from '@/features/guests/components/DeleteGuestDialog';
import { SendInvitationDialog } from '@/features/guests/components/SendInvitationDialog';
import { BulkInvitationDialog } from '@/features/guests/components/BulkInvitationDialog';
import type { GuestDto } from '@/features/weddings/types';

export function GuestsPage() {
  const { t } = useTranslation(['guests', 'auth', 'common', 'weddings']);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const logout = useLogout();

  const weddingIdFromUrl = searchParams.get('weddingId');
  const statusFilter = searchParams.get('status'); // 'attending', 'pending', 'declined', or null for all

  // Optimization: Only fetch all weddings if we don't have a weddingId in URL
  // When weddingId is in URL, we already have context and don't need to fetch all weddings
  const { data: weddings, isLoading: weddingsLoading } = useWeddings({
    enabled: !weddingIdFromUrl
  });

  // Get wedding ID from URL params or use first wedding (when no URL param)
  const selectedWeddingId = weddingIdFromUrl || weddings?.[0]?.id || '';
  const { data: allGuests, isLoading: guestsLoading, error } = useGuests(selectedWeddingId);
  const sendBulkInvitations = useSendGuestInvitations();

  // Filter guests based on status
  const guests = useMemo(() => {
    if (!allGuests) return [];
    if (!statusFilter) return allGuests;

    switch (statusFilter) {
      case 'attending':
        return allGuests.filter((g) => g.rsvpStatus === 1);
      case 'pending':
        return allGuests.filter((g) => g.rsvpStatus === 0);
      case 'declined':
        return allGuests.filter((g) => g.rsvpStatus === 2);
      case 'maybe':
        return allGuests.filter((g) => g.rsvpStatus === 3);
      default:
        return allGuests;
    }
  }, [allGuests, statusFilter]);

  const [editingGuest, setEditingGuest] = useState<GuestDto | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<GuestDto | null>(null);
  const [sendingInvitationGuest, setSendingInvitationGuest] = useState<GuestDto | null>(null);
  const [bulkInviteGuestIds, setBulkInviteGuestIds] = useState<string[]>([]);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  // Calculate statistics (always use all guests for stats)
  const stats = useMemo(() => {
    if (!allGuests) return { total: 0, attending: 0, declined: 0, pending: 0, maybe: 0 };

    return {
      total: allGuests.length,
      attending: allGuests.filter((g) => g.rsvpStatus === 1).length,
      declined: allGuests.filter((g) => g.rsvpStatus === 2).length,
      pending: allGuests.filter((g) => g.rsvpStatus === 0).length,
      maybe: allGuests.filter((g) => g.rsvpStatus === 3).length,
    };
  }, [allGuests]);

  const handleWeddingChange = (weddingId: string) => {
    setSearchParams({ weddingId });
  };

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('status');
    setSearchParams(params);
  };

  const setFilter = (status: string | null) => {
    const params = new URLSearchParams(searchParams);

    // If clicking on the currently active filter, toggle it off (show all guests)
    if (status && statusFilter === status) {
      params.delete('status');
    } else if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    setSearchParams(params);
  };

  const getFilterLabel = () => {
    switch (statusFilter) {
      case 'attending':
        return t('guests:attending');
      case 'pending':
        return t('guests:pending');
      case 'declined':
        return t('guests:declined');
      case 'maybe':
        return t('guests:maybe');
      default:
        return null;
    }
  };

  const handleBulkSendInvitations = (guestIds: string[]) => {
    // Show confirmation dialog
    setBulkInviteGuestIds(guestIds);
    setShowBulkConfirm(true);
  };

  const confirmBulkSendInvitations = async () => {
    if (!selectedWeddingId || bulkInviteGuestIds.length === 0) return;

    try {
      await sendBulkInvitations.mutateAsync({
        weddingId: selectedWeddingId,
        guestIds: bulkInviteGuestIds
      });
      // Success - React Query will handle cache invalidation
      setBulkInviteGuestIds([]);
    } catch (error) {
      // Error handled by React Query
    }
  };

  const selectedWedding = weddings?.find((w) => w.id === selectedWeddingId);

  if (weddingsLoading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <p className="text-muted-foreground">{t('common:loading')}</p>
      </div>
    );
  }

  if (!weddingIdFromUrl && (!weddings || weddings.length === 0)) {
    return (
      <div className="min-h-screen bg-muted/40">
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold">{t('common:appName')}</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground">{user?.name}</span>
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
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">{user?.name}</span>
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
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold">{t('guests:title')}</h2>
              {statusFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getFilterLabel()}
                  <button
                    onClick={clearFilter}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{t('guests:manageDescription')}</p>
          </div>
          <CreateGuestDialog weddingId={selectedWeddingId}>
            <Button>{t('guests:addGuest')}</Button>
          </CreateGuestDialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <Card
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${!statusFilter ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setFilter(null)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:totalGuests')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">{t('guests:stats.allGuests')}</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${statusFilter === 'attending' ? 'ring-2 ring-green-600' : ''}`}
            onClick={() => setFilter('attending')}
          >
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

          <Card
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${statusFilter === 'declined' ? 'ring-2 ring-red-600' : ''}`}
            onClick={() => setFilter('declined')}
          >
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

          <Card
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${statusFilter === 'pending' ? 'ring-2 ring-yellow-600' : ''}`}
            onClick={() => setFilter('pending')}
          >
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

          <Card
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${statusFilter === 'maybe' ? 'ring-2 ring-blue-600' : ''}`}
            onClick={() => setFilter('maybe')}
          >
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
        {selectedWeddingId && (
          <Card>
            <CardHeader>
              <CardTitle>{t('guests:guestList')}</CardTitle>
              {selectedWedding && (
                <CardDescription>
                  {statusFilter
                    ? `Showing ${guests.length} ${getFilterLabel()?.toLowerCase()} guest${guests.length !== 1 ? 's' : ''} for ${selectedWedding.title}`
                    : t('guests:guestListDescription', { wedding: selectedWedding.title })}
                </CardDescription>
              )}
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
                  onSendInvitation={setSendingInvitationGuest}
                  onBulkSendInvitations={handleBulkSendInvitations}
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

      {/* Send Invitation Dialog */}
      <SendInvitationDialog
        guest={sendingInvitationGuest}
        open={!!sendingInvitationGuest}
        onOpenChange={(open) => !open && setSendingInvitationGuest(null)}
      />

      {/* Bulk Invitation Confirmation Dialog */}
      <BulkInvitationDialog
        guestCount={bulkInviteGuestIds.length}
        open={showBulkConfirm}
        onOpenChange={setShowBulkConfirm}
        onConfirm={confirmBulkSendInvitations}
      />
    </div>
  );
}
