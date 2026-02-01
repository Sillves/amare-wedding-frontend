import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useUpdateWedding } from '../hooks/useWeddings';
import type { WeddingDto } from '../types';
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
import { parseISO } from 'date-fns';

// Get today at midnight for date comparison
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const editWeddingSchema = z.object({
  title: z.string().min(1, 'weddings:validation.nameRequired'),
  date: z.date({ required_error: 'weddings:validation.dateRequired' })
    .refine((date) => date >= getToday(), {
      message: 'weddings:validation.dateInPast',
    }),
  location: z.string().min(1, 'weddings:validation.locationRequired'),
});

type EditWeddingFormData = z.infer<typeof editWeddingSchema>;

interface EditWeddingDialogProps {
  wedding: WeddingDto;
  children: React.ReactNode;
}

/**
 * Check if a date string represents a valid, user-set date
 */
function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const date = parseISO(dateString);
  return !isNaN(date.getTime()) && date.getFullYear() > 1900;
}

export function EditWeddingDialog({ wedding, children }: EditWeddingDialogProps) {
  const { t } = useTranslation(['weddings', 'common']);
  const [open, setOpen] = useState(false);
  const updateWeddingMutation = useUpdateWedding();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<EditWeddingFormData>({
    resolver: zodResolver(editWeddingSchema),
    defaultValues: {
      title: wedding.title || '',
      date: isValidDate(wedding.date) ? parseISO(wedding.date!) : undefined,
      location: wedding.location || '',
    },
  });

  // Reset form when wedding changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        title: wedding.title || '',
        date: isValidDate(wedding.date) ? parseISO(wedding.date!) : undefined,
        location: wedding.location || '',
      });
    }
  }, [open, wedding, reset]);

  const onSubmit = (data: EditWeddingFormData) => {
    // Set time to noon to avoid timezone edge cases
    const dateWithNoon = new Date(data.date);
    dateWithNoon.setHours(12, 0, 0, 0);
    const isoDate = dateWithNoon.toISOString();

    updateWeddingMutation.mutate(
      {
        id: wedding.id!,
        data: {
          title: data.title,
          date: isoDate,
          location: data.location,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('weddings:editWedding')}</DialogTitle>
          <DialogDescription>{t('weddings:editWeddingDescription')}</DialogDescription>
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
                  minDate={getToday()}
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

          {updateWeddingMutation.isError && (
            <p className="text-sm text-destructive">{t('weddings:updateError')}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button type="submit" disabled={updateWeddingMutation.isPending}>
              {updateWeddingMutation.isPending ? t('common:loading') : t('common:save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
