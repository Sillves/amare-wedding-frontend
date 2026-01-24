import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useCreateWedding } from '../hooks/useWeddings';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const createWeddingSchema = z.object({
  title: z.string().min(1, 'weddings:validation.nameRequired'),
  date: z.string().min(1, 'weddings:validation.dateRequired'),
  location: z.string().min(1, 'weddings:validation.locationRequired'),
});

type CreateWeddingFormData = z.infer<typeof createWeddingSchema>;

interface CreateWeddingDialogProps {
  children: React.ReactNode;
}

export function CreateWeddingDialog({ children }: CreateWeddingDialogProps) {
  const { t } = useTranslation(['weddings', 'common']);
  const [open, setOpen] = useState(false);
  const createWeddingMutation = useCreateWedding();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateWeddingFormData>({
    resolver: zodResolver(createWeddingSchema),
  });

  const onSubmit = (data: CreateWeddingFormData) => {
    // Convert date string (YYYY-MM-DD) to ISO 8601 timestamp using user's local timezone
    // Using noon (12:00) to avoid timezone edge cases where the date might shift
    const dateObj = new Date(data.date + 'T12:00:00');
    const isoDate = dateObj.toISOString();

    createWeddingMutation.mutate(
      {
        title: data.title,
        date: isoDate,
        location: data.location,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('weddings:createWedding')}</DialogTitle>
          <DialogDescription>{t('weddings:createWeddingDescription')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('weddings:form.name')}</Label>
            <Input
              id="title"
              placeholder={t('weddings:form.namePlaceholder')}
              {...register('title')}
            />
            {errors.title && <p className="text-sm text-destructive">{t(errors.title.message!)}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{t('weddings:form.date')}</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-sm text-destructive">{t(errors.date.message!)}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('weddings:form.location')}</Label>
            <Input
              id="location"
              placeholder={t('weddings:form.locationPlaceholder')}
              {...register('location')}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{t(errors.location.message!)}</p>
            )}
          </div>

          {createWeddingMutation.isError && (
            <p className="text-sm text-destructive">{t('weddings:createError')}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button type="submit" disabled={createWeddingMutation.isPending}>
              {createWeddingMutation.isPending ? t('common:loading') : t('common:create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
