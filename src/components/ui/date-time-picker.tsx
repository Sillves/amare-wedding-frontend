import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Generate hour options (00-23)
const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
// Generate minute options (00, 15, 30, 45) for easier selection
const minutes = ['00', '15', '30', '45'];

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  showTime?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  showTime = true,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }

    // Preserve the time from the current value if it exists, otherwise default to 12:00
    if (value && showTime) {
      date.setHours(value.getHours(), value.getMinutes());
    } else if (showTime) {
      date.setHours(12, 0);
    }
    onChange(date);
  };

  const handleHourChange = (hour: string) => {
    const newDate = value ? new Date(value) : new Date();
    newDate.setHours(parseInt(hour), newDate.getMinutes());
    onChange(newDate);
  };

  const handleMinuteChange = (minute: string) => {
    const newDate = value ? new Date(value) : new Date();
    newDate.setMinutes(parseInt(minute));
    onChange(newDate);
  };

  const currentHour = value ? value.getHours().toString().padStart(2, '0') : '';
  const currentMinute = value ? value.getMinutes().toString().padStart(2, '0') : '';
  // Round to nearest 15 min for display, but allow exact value if set
  const displayMinute = currentMinute && minutes.includes(currentMinute)
    ? currentMinute
    : currentMinute;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            showTime ? format(value, 'PPP HH:mm') : format(value, 'PPP')
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          initialFocus
        />
        {showTime && (
          <div className="border-t p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Select value={currentHour} onValueChange={handleHourChange}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">:</span>
              <Select value={displayMinute} onValueChange={handleMinuteChange}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
}: DatePickerProps) {
  return (
    <DateTimePicker
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      showTime={false}
    />
  );
}
