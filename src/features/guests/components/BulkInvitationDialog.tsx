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

interface BulkInvitationDialogProps {
  guestCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function BulkInvitationDialog({ guestCount, open, onOpenChange, onConfirm }: BulkInvitationDialogProps) {
  const { t } = useTranslation('guests');

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('bulkInvitation.title', { count: guestCount })}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('bulkInvitation.message', { count: guestCount })} {t('bulkInvitation.confirm')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('bulkInvitation.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {t('bulkInvitation.confirmButton')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
