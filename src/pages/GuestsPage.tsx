import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, UserCheck, UserX, Clock, X, Heart, Sparkles, HelpCircle, Upload } from 'lucide-react';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useGuests, useSendGuestInvitations } from '@/features/guests/hooks/useGuests';
import { useErrorToast } from '@/hooks/useErrorToast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestTable } from '@/features/guests/components/GuestTable';
import { CreateGuestDialog } from '@/features/guests/components/CreateGuestDialog';
import { EditGuestDialog } from '@/features/guests/components/EditGuestDialog';
import { DeleteGuestDialog } from '@/features/guests/components/DeleteGuestDialog';
import { SendInvitationDialog } from '@/features/guests/components/SendInvitationDialog';
import { BulkInvitationDialog } from '@/features/guests/components/BulkInvitationDialog';
import { ImportGuestsDialog } from '@/features/guests/components/ImportGuestsDialog';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { FontSizeSwitcher } from '@/shared/components/FontSizeSwitcher';
import type { GuestDto } from '@/features/weddings/types';

/**
 * Floating decorative elements for premium aesthetic
 */
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating hearts */}
      <div className="absolute top-[15%] left-[8%] animate-float-slow opacity-15">
        <Heart className="h-5 w-5 text-primary fill-primary" />
      </div>
      <div className="absolute top-[25%] right-[5%] animate-float-medium opacity-10">
        <Heart className="h-4 w-4 text-primary fill-primary" />
      </div>
      <div className="absolute bottom-[30%] left-[15%] animate-float-fast opacity-10">
        <Heart className="h-6 w-6 text-primary fill-primary" />
      </div>

      {/* Sparkles */}
      <div className="absolute top-[20%] right-[15%] animate-pulse-slow opacity-20">
        <Sparkles className="h-4 w-4 text-amber-400" />
      </div>
      <div className="absolute bottom-[25%] left-[20%] animate-pulse-medium opacity-15">
        <Sparkles className="h-3 w-3 text-amber-400" />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-[35%] right-[3%] animate-spin-very-slow opacity-10">
        <div className="w-10 h-10 rounded-full border-2 border-primary" />
      </div>
    </div>
  );
}

export function GuestsPage() {
  const { t } = useTranslation(['guests', 'auth', 'common', 'weddings']);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const logout = useLogout();

  // Check if user can send emails (Starter or Pro tier - Free has 0 emails/month)
  const canSendEmails = user?.subscriptionTier === 1 || user?.subscriptionTier === 2;

  const weddingIdFromUrl = searchParams.get('weddingId');
  const statusFilter = searchParams.get('status'); // 'attending', 'pending', 'declined', or null for all

  const { data: weddings, isLoading: weddingsLoading } = useWeddings();

  // Get wedding ID from URL params or use first wedding (when no URL param)
  const selectedWeddingId = weddingIdFromUrl || weddings?.[0]?.id || '';
  const { data: allGuests, isLoading: guestsLoading, error } = useGuests(selectedWeddingId);
  const sendBulkInvitations = useSendGuestInvitations();
  const { showError, showSuccess } = useErrorToast();

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
  const [showImportDialog, setShowImportDialog] = useState(false);

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
      showSuccess(t('guests:messages.invitationsSent', { count: bulkInviteGuestIds.length }));
      setBulkInviteGuestIds([]);
    } catch (error) {
      showError(error);
    }
  };

  const selectedWedding = weddings?.find((w) => w.id === selectedWeddingId);
  const isReadOnly = selectedWedding ? selectedWedding.role !== 0 && (selectedWedding.isReadOnly ?? false) : false;

  if (weddingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <Heart className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-serif">{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  if (!weddingIdFromUrl && (!weddings || weddings.length === 0)) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <Heart className="h-6 w-6 text-primary fill-primary transition-transform group-hover:scale-110" />
              <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                {t('auth:logout')}
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 relative">
          <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center bg-card/80 backdrop-blur-sm">
            <p className="mb-4 text-muted-foreground">{t('weddings:noWeddings')}</p>
            <Button onClick={() => navigate('/dashboard')} className="rounded-xl shadow-lg shadow-primary/25">
              {t('weddings:createWedding')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <FloatingElements />

      {/* Premium Header */}
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
              <span className="text-2xl font-script text-primary">{t('common:appName')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <FontSizeSwitcher />
              <ThemeSwitcher />
            </div>
            <span className="hidden md:inline text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout} className="rounded-xl">
              {t('auth:logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 relative">
        {/* Header with title and action */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-serif font-semibold">{t('guests:title')}</h1>
              {statusFilter && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
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
          {!isReadOnly && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setShowImportDialog(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('guests:import.button')}
              </Button>
              <CreateGuestDialog weddingId={selectedWeddingId}>
                <Button className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow">
                  <Users className="h-4 w-4 mr-2" />
                  {t('guests:addGuest')}
                </Button>
              </CreateGuestDialog>
            </div>
          )}
        </section>

        {/* Statistics Cards */}
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-5 animate-fade-in-up animation-delay-200">
          {/* Total Guests */}
          <Card
            className={`rounded-2xl border-border/50 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm group ${!statusFilter ? 'ring-2 ring-primary shadow-lg' : ''}`}
            onClick={() => setFilter(null)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:totalGuests')}</CardTitle>
              <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('guests:stats.allGuests')}</p>
            </CardContent>
          </Card>

          {/* Attending */}
          <Card
            className={`rounded-2xl border-border/50 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm group hover:border-green-500/30 ${statusFilter === 'attending' ? 'ring-2 ring-green-600 shadow-lg' : ''}`}
            onClick={() => setFilter('attending')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:attending')}</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-green-600">{stats.attending}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0 ? Math.round((stats.attending / stats.total) * 100) : 0}%{' '}
                {t('guests:stats.confirmed')}
              </p>
            </CardContent>
          </Card>

          {/* Declined */}
          <Card
            className={`rounded-2xl border-border/50 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm group hover:border-red-500/30 ${statusFilter === 'declined' ? 'ring-2 ring-red-600 shadow-lg' : ''}`}
            onClick={() => setFilter('declined')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:declined')}</CardTitle>
              <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                <UserX className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-red-600">{stats.declined}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0 ? Math.round((stats.declined / stats.total) * 100) : 0}%{' '}
                {t('guests:stats.declined')}
              </p>
            </CardContent>
          </Card>

          {/* Pending */}
          <Card
            className={`rounded-2xl border-border/50 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm group hover:border-amber-500/30 ${statusFilter === 'pending' ? 'ring-2 ring-amber-600 shadow-lg' : ''}`}
            onClick={() => setFilter('pending')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:pending')}</CardTitle>
              <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-amber-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%{' '}
                {t('guests:stats.pending')}
              </p>
            </CardContent>
          </Card>

          {/* Maybe */}
          <Card
            className={`rounded-2xl border-border/50 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm group hover:border-blue-500/30 ${statusFilter === 'maybe' ? 'ring-2 ring-blue-600 shadow-lg' : ''}`}
            onClick={() => setFilter('maybe')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:maybe')}</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <HelpCircle className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-blue-600">{stats.maybe}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0 ? Math.round((stats.maybe / stats.total) * 100) : 0}%{' '}
                {t('guests:stats.maybe')}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Guests Table */}
        {selectedWeddingId && (
          <section className="animate-fade-in-up animation-delay-400">
            <Card className="rounded-2xl border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl">{t('guests:guestList')}</CardTitle>
                {selectedWedding && (
                  <CardDescription>
                    {statusFilter
                      ? t('guests:showingGuests', { count: guests.length, status: getFilterLabel()?.toLowerCase(), wedding: selectedWedding.title })
                      : t('guests:guestListDescription', { wedding: selectedWedding.title })}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {guestsLoading ? (
                  <div className="p-8 text-center">
                    <Heart className="h-8 w-8 text-primary mx-auto animate-pulse mb-4" />
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
                    canSendEmails={canSendEmails}
                    onUpgrade={() => navigate('/pricing')}
                  />
                )}
              </CardContent>
            </Card>
          </section>
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

      {/* Import Guests Dialog */}
      <ImportGuestsDialog
        weddingId={selectedWeddingId}
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </div>
  );
}
