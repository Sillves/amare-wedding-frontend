import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, Clock, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestTable } from '@/features/guests/components/GuestTable';
import { DemoProvider, useDemoContext } from '@/features/demo/context/DemoContext';
import { DemoBanner } from '@/features/demo/components/DemoBanner';
import {
  DemoCreateGuestDialog,
  DemoEditGuestDialog,
  DemoDeleteGuestDialog,
} from '@/features/demo/components/DemoGuestDialogs';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import type { GuestDto } from '@/features/weddings/types';

function DemoGuestsContent() {
  const { t } = useTranslation(['guests', 'common', 'demo', 'events', 'expenses']);
  const navigate = useNavigate();
  const { guests } = useDemoContext();

  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestDto | null>(null);

  // Filter guests based on status
  const filteredGuests = useMemo(() => {
    if (!statusFilter) return guests;

    switch (statusFilter) {
      case 'attending':
        return guests.filter((g) => g.rsvpStatus === 1);
      case 'pending':
        return guests.filter((g) => g.rsvpStatus === 0);
      case 'declined':
        return guests.filter((g) => g.rsvpStatus === 2);
      case 'maybe':
        return guests.filter((g) => g.rsvpStatus === 3);
      default:
        return guests;
    }
  }, [guests, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: guests.length,
      attending: guests.filter((g) => g.rsvpStatus === 1).length,
      declined: guests.filter((g) => g.rsvpStatus === 2).length,
      pending: guests.filter((g) => g.rsvpStatus === 0).length,
      maybe: guests.filter((g) => g.rsvpStatus === 3).length,
    };
  }, [guests]);

  const handleEdit = (guest: GuestDto) => {
    setSelectedGuest(guest);
    setEditDialogOpen(true);
  };

  const handleDelete = (guest: GuestDto) => {
    setSelectedGuest(guest);
    setDeleteDialogOpen(true);
  };

  const handleSendInvitation = () => {
    // Demo - just show it works but don't actually send
  };

  return (
    <div className="min-h-screen bg-muted/40 overflow-x-hidden">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">{t('common:appName')}</span>
            <Badge variant="secondary" className="ml-2">
              Demo
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1 sm:gap-3">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            <Button variant="outline" size="sm" className="px-2 sm:px-4" onClick={() => navigate('/')}>
              {t('demo:exitDemo')}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto">
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo')}>
              {t('common:dashboard.title')}
            </Button>
            <Button
              variant="ghost"
              className="rounded-none border-b-2 border-primary"
              onClick={() => navigate('/demo/guests')}
            >
              {t('guests:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/events')}>
              {t('events:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/expenses')}>
              {t('expenses:title')}
            </Button>
            <Button variant="ghost" className="rounded-none" onClick={() => navigate('/demo/rsvp')}>
              RSVP
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 space-y-6">
        {/* Demo Banner */}
        <DemoBanner />

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">{t('guests:title')}</h2>
            <p className="text-muted-foreground">{t('guests:manageDescription')}</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('guests:addGuest')}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${!statusFilter ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setStatusFilter(null)}
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
            onClick={() => setStatusFilter(statusFilter === 'attending' ? null : 'attending')}
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
            onClick={() => setStatusFilter(statusFilter === 'declined' ? null : 'declined')}
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
            onClick={() => setStatusFilter(statusFilter === 'pending' ? null : 'pending')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('guests:pending')}</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">{t('guests:stats.pending')}</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${statusFilter === 'maybe' ? 'ring-2 ring-blue-600' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'maybe' ? null : 'maybe')}
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
        <Card>
          <CardHeader>
            <CardTitle>{t('guests:guestList')}</CardTitle>
            <CardDescription>
              {statusFilter
                ? t('guests:showingAllGuests', { count: filteredGuests.length, wedding: 'Emma & James' })
                : t('guests:guestListDescription', { wedding: 'Emma & James' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GuestTable
              guests={filteredGuests}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSendInvitation={handleSendInvitation}
              onBulkSendInvitations={handleSendInvitation}
            />
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      <DemoCreateGuestDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <DemoEditGuestDialog
        guest={selectedGuest}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DemoDeleteGuestDialog
        guest={selectedGuest}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}

export function DemoGuestsPage() {
  return (
    <DemoProvider>
      <DemoGuestsContent />
    </DemoProvider>
  );
}
