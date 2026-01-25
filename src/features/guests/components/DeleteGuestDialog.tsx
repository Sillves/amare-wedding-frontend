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
import { useDeleteGuest } from '../hooks/useGuests';
import type { GuestDto } from '@/features/weddings/types';

interface DeleteGuestDialogProps {
  guest: GuestDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteGuestDialog({ guest, open, onOpenChange }: DeleteGuestDialogProps) {
  const { t } = useTranslation('guests');
  const deleteGuest = useDeleteGuest();

  const handleDelete = async () => {
    if (!guest) return;

    try {
      await deleteGuest.mutateAsync({
        guestId: guest.id!,
        weddingId: guest.weddingId!,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete guest:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteConfirm.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteConfirm.message', { name: guest?.name || '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('deleteConfirm.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteGuest.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteGuest.isPending ? t('actions.deleting') : t('deleteConfirm.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
