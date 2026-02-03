import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@/lib/dateLocale';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'dropdown',
  ...props
}: CalendarProps) {
  const { i18n } = useTranslation();
  const locale = getDateFnsLocale(i18n.language);
  // Default date range for dropdown: 10 years back, 10 years forward
  const currentYear = new Date().getFullYear();
  const defaultStartMonth = props.startMonth || new Date(currentYear - 10, 0);
  const defaultEndMonth = props.endMonth || new Date(currentYear + 10, 11);

  return (
    <DayPicker
      locale={locale}
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      startMonth={defaultStartMonth}
      endMonth={defaultEndMonth}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center pt-1 relative items-center gap-2',
        caption_label: captionLayout === 'dropdown' ? 'sr-only' : 'text-sm font-medium',
        dropdowns: 'flex gap-2 items-center',
        dropdown: 'text-sm font-medium bg-background border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute -left-3'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute -right-3'
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center',
        week: 'flex w-full mt-2',
        day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
        ),
        range_start: 'day-range-start rounded-l-md',
        range_end: 'day-range-end rounded-r-md',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md',
        today: 'bg-accent text-accent-foreground rounded-md',
        outside:
          'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
