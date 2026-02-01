import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSendGuestInvitation } from '../hooks/useGuests';
import { useErrorToast } from '@/hooks/useErrorToast';
import type { GuestDto } from '@/features/weddings/types';

interface SendInvitationDialogProps {
  guest: GuestDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendInvitationDialog({ guest, open, onOpenChange }: SendInvitationDialogProps) {
  const { t } = useTranslation('guests');
  const sendInvitation = useSendGuestInvitation();
  const { showError, showSuccess } = useErrorToast();

  const handleSend = async () => {
    if (!guest || !guest.email) return;

    try {
      await sendInvitation.mutateAsync({
        weddingId: guest.weddingId!,
        guestId: guest.id!,
      });
      showSuccess(t('sendInvitationConfirm.successMessage', { email: guest.email }));
      onOpenChange(false);
    } catch (error) {
      showError(error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('sendInvitationConfirm.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('sendInvitationConfirm.message', { name: guest?.name || '', email: guest?.email || '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('sendInvitationConfirm.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSend}
            disabled={sendInvitation.isPending}
          >
            {sendInvitation.isPending ? t('actions.sending') : t('sendInvitationConfirm.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
