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
import { useDeleteEvent } from '../hooks/useEvents';
import { useErrorToast } from '@/hooks/useErrorToast';
import type { EventDto } from '@/features/weddings/types';

interface DeleteEventDialogProps {
  event: EventDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteEventDialog({ event, open, onOpenChange }: DeleteEventDialogProps) {
  const { t } = useTranslation('events');
  const deleteEvent = useDeleteEvent();
  const { showError, showSuccess } = useErrorToast();

  const handleDelete = async () => {
    if (!event) return;

    try {
      await deleteEvent.mutateAsync({
        eventId: event.id!,
        weddingId: event.weddingId!,
      });
      showSuccess(t('messages.deleted'));
      onOpenChange(false);
    } catch (error) {
      showError(error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteConfirm.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteConfirm.message', { name: event?.name || '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('deleteConfirm.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteEvent.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteEvent.isPending ? t('actions.deleting') : t('deleteConfirm.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
