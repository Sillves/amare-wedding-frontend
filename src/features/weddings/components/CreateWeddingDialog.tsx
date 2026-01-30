import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useCreateWedding } from '../hooks/useWeddings';
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
import { DatePicker } from '@/components/ui/date-time-picker';

const createWeddingSchema = z.object({
  title: z.string().min(1, 'weddings:validation.nameRequired'),
  date: z.date({ required_error: 'weddings:validation.dateRequired' }),
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
    control,
  } = useForm<CreateWeddingFormData>({
    resolver: zodResolver(createWeddingSchema),
  });

  const onSubmit = (data: CreateWeddingFormData) => {
    // Set time to noon to avoid timezone edge cases
    const dateWithNoon = new Date(data.date);
    dateWithNoon.setHours(12, 0, 0, 0);
    const isoDate = dateWithNoon.toISOString();

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
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('weddings:form.datePlaceholder')}
                />
              )}
            />
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
