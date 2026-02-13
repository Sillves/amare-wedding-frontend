import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useWeddingInvitations,
  useCreateInvitation,
  useCancelInvitation,
  useWeddingUsers,
  useRemoveWeddingUser,
  useUpdateWeddingUserPermissions,
} from '../hooks/useInvitations';
import type { CreateWeddingInvitationRequest } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useErrorToast } from '@/hooks/useErrorToast';
import { UserPlus, X, Settings, Trash2, Mail, Clock } from 'lucide-react';

interface TeamTabProps {
  weddingId: string;
}

type AccessPreset = 'full' | 'viewOnly' | 'custom';

function getPresetPermissions(preset: AccessPreset): Omit<CreateWeddingInvitationRequest, 'email'> {
  switch (preset) {
    case 'full':
      return { canAccessGuests: true, canAccessEvents: true, canAccessExpenses: true, canAccessWebsite: true, isReadOnly: false };
    case 'viewOnly':
      return { canAccessGuests: true, canAccessEvents: true, canAccessExpenses: true, canAccessWebsite: true, isReadOnly: true };
    case 'custom':
      return { canAccessGuests: true, canAccessEvents: true, canAccessExpenses: false, canAccessWebsite: false, isReadOnly: false };
  }
}

export function TeamTab({ weddingId }: TeamTabProps) {
  const { t } = useTranslation(['common', 'guests', 'events', 'expenses', 'website']);
  const { showError, showSuccess } = useErrorToast();

  const { data: users } = useWeddingUsers(weddingId);
  const { data: invitations } = useWeddingInvitations(weddingId);
  const createInvitation = useCreateInvitation();
  const cancelInvitation = useCancelInvitation();
  const removeUser = useRemoveWeddingUser();
  const updatePermissions = useUpdateWeddingUserPermissions();

  const [email, setEmail] = useState('');
  const [preset, setPreset] = useState<AccessPreset>('full');
  const [customPerms, setCustomPerms] = useState(getPresetPermissions('custom'));
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editPerms, setEditPerms] = useState(getPresetPermissions('full'));

  const planners = users?.filter(u => u.role === 1) ?? [];
  const pendingInvitations = invitations?.filter(i => !i.acceptedAt) ?? [];

  const handleInvite = async () => {
    if (!email.trim()) return;
    const perms = preset === 'custom' ? customPerms : getPresetPermissions(preset);
    try {
      await createInvitation.mutateAsync({
        weddingId,
        data: { email: email.trim(), ...perms },
      });
      showSuccess(t('common:planner.inviteSent'));
      setEmail('');
    } catch (error) {
      showError(error);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await cancelInvitation.mutateAsync({ weddingId, invitationId });
    } catch (error) {
      showError(error);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUser.mutateAsync({ weddingId, userId });
      showSuccess(t('common:planner.collaboratorRemoved'));
    } catch (error) {
      showError(error);
    }
  };

  const handleUpdatePermissions = async (userId: string) => {
    try {
      await updatePermissions.mutateAsync({ weddingId, userId, data: editPerms });
      showSuccess(t('common:planner.permissionsUpdated'));
      setEditingUser(null);
    } catch (error) {
      showError(error);
    }
  };

  const startEditUser = (user: typeof planners[0]) => {
    setEditPerms({
      canAccessGuests: user.canAccessGuests ?? true,
      canAccessEvents: user.canAccessEvents ?? true,
      canAccessExpenses: user.canAccessExpenses ?? false,
      canAccessWebsite: user.canAccessWebsite ?? false,
      isReadOnly: user.isReadOnly ?? false,
    });
    setEditingUser(user.userId ?? null);
  };

  return (
    <Card className="rounded-2xl border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl">{t('common:planner.team')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite Form */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">{t('common:planner.invitePlanner')}</h3>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder={t('common:planner.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleInvite}
              disabled={!email.trim() || createInvitation.isPending}
              size="sm"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {t('common:planner.sendInvitation')}
            </Button>
          </div>

          <RadioGroup value={preset} onValueChange={(v) => setPreset(v as AccessPreset)} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="full" />
              <Label htmlFor="full">{t('common:planner.fullAccess')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="viewOnly" id="viewOnly" />
              <Label htmlFor="viewOnly">{t('common:planner.viewOnly')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom">{t('common:planner.custom')}</Label>
            </div>
          </RadioGroup>

          {preset === 'custom' && (
            <PermissionToggles perms={customPerms} onChange={setCustomPerms} t={t} />
          )}
        </div>

        {/* Collaborators */}
        {planners.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">{t('common:planner.collaborators')}</h3>
            {planners.map((user) => (
              <div key={user.userId} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.userId}</span>
                  <Badge variant={user.isReadOnly ? 'secondary' : 'default'} className="text-xs">
                    {user.isReadOnly ? t('common:planner.viewOnly') : t('common:planner.fullAccess')}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Dialog open={editingUser === user.userId} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => startEditUser(user)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('common:planner.editPermissions')}</DialogTitle>
                      </DialogHeader>
                      <PermissionToggles perms={editPerms} onChange={setEditPerms} t={t} />
                      <Button
                        onClick={() => handleUpdatePermissions(user.userId!)}
                        disabled={updatePermissions.isPending}
                      >
                        {t('common:save')}
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveUser(user.userId!)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">{t('common:planner.pendingInvitations')}</h3>
            {pendingInvitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">{inv.email}</span>
                  <Badge variant="outline" className="text-xs">
                    {t('common:planner.pendingInvitations')}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancelInvitation(inv.id!)}
                  disabled={cancelInvitation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PermissionToggles({
  perms,
  onChange,
  t,
}: {
  perms: Omit<CreateWeddingInvitationRequest, 'email'>;
  onChange: (perms: Omit<CreateWeddingInvitationRequest, 'email'>) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{t('guests:title')}</Label>
        <Switch checked={perms.canAccessGuests} onCheckedChange={(v) => onChange({ ...perms, canAccessGuests: v })} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">{t('events:title')}</Label>
        <Switch checked={perms.canAccessEvents} onCheckedChange={(v) => onChange({ ...perms, canAccessEvents: v })} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">{t('expenses:title')}</Label>
        <Switch checked={perms.canAccessExpenses} onCheckedChange={(v) => onChange({ ...perms, canAccessExpenses: v })} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">{t('website:title')}</Label>
        <Switch checked={perms.canAccessWebsite} onCheckedChange={(v) => onChange({ ...perms, canAccessWebsite: v })} />
      </div>
      <div className="flex items-center justify-between col-span-2">
        <Label className="text-sm">{t('common:planner.readOnly')}</Label>
        <Switch checked={perms.isReadOnly} onCheckedChange={(v) => onChange({ ...perms, isReadOnly: v })} />
      </div>
    </div>
  );
}
