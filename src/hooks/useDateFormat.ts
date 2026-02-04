import { useState, useEffect, useCallback } from 'react';
import { format, isSameDay } from 'date-fns';
import { getDateFnsLocale } from '@/lib/dateLocale';
import i18n from '@/lib/i18n';

export type TimeFormatPreference = '12h' | '24h';

const STORAGE_KEY = 'dateFormatPreference';

function getStoredPreference(): TimeFormatPreference {
  if (typeof window === 'undefined') return '24h';
  const stored = localStorage.getItem(STORAGE_KEY);
  return (stored === '12h' || stored === '24h') ? stored : '24h';
}

/**
 * Hook for managing date/time format preferences
 */
export function useDateFormat() {
  const [timeFormat, setTimeFormatState] = useState<TimeFormatPreference>(getStoredPreference);

  useEffect(() => {
    // Sync with localStorage on mount
    setTimeFormatState(getStoredPreference());
  }, []);

  const setTimeFormat = useCallback((format: TimeFormatPreference) => {
    localStorage.setItem(STORAGE_KEY, format);
    setTimeFormatState(format);
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('dateFormatChange', { detail: format }));
  }, []);

  return { timeFormat, setTimeFormat };
}

/**
 * Get the current time format preference (non-hook version for utilities)
 */
export function getTimeFormatPreference(): TimeFormatPreference {
  return getStoredPreference();
}

/**
 * Format a date string to display date only
 */
export function formatDate(dateString: string, style: 'full' | 'short' | 'medium' = 'medium'): string {
  try {
    const date = new Date(dateString);
    const locale = getDateFnsLocale(i18n.language);

    switch (style) {
      case 'full':
        return format(date, 'PPPP', { locale }); // e.g., "Saturday, January 1st, 2025"
      case 'short':
        return format(date, 'PP', { locale }); // e.g., "Jan 1, 2025"
      case 'medium':
      default:
        return format(date, 'PPP', { locale }); // e.g., "January 1st, 2025"
    }
  } catch {
    return dateString;
  }
}

/**
 * Format a date string to display time only, respecting user preference
 */
export function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const locale = getDateFnsLocale(i18n.language);
    const timeFormat = getTimeFormatPreference();

    // 'p' = localized time, 'HH:mm' = 24-hour format
    const formatString = timeFormat === '12h' ? 'p' : 'HH:mm';
    return format(date, formatString, { locale });
  } catch {
    return dateString;
  }
}

/**
 * Format a date string to display both date and time
 */
export function formatDateTime(dateString: string, dateStyle: 'full' | 'short' | 'medium' = 'medium'): string {
  try {
    const date = new Date(dateString);
    const locale = getDateFnsLocale(i18n.language);
    const timeFormat = getTimeFormatPreference();

    let dateFormatStr: string;
    switch (dateStyle) {
      case 'full':
        dateFormatStr = 'PPPP';
        break;
      case 'short':
        dateFormatStr = 'PP';
        break;
      case 'medium':
      default:
        dateFormatStr = 'PPP';
    }

    const timeFormatStr = timeFormat === '12h' ? 'p' : 'HH:mm';
    return format(date, `${dateFormatStr} ${timeFormatStr}`, { locale });
  } catch {
    return dateString;
  }
}

/**
 * Format event date range intelligently:
 * - If no end date: just show start date/time
 * - If same day: show date + start time - end time
 * - If different days: show full start datetime - full end datetime
 */
export function formatEventDateRange(
  startDateString: string,
  endDateString?: string | null
): string {
  try {
    const startDate = new Date(startDateString);
    const locale = getDateFnsLocale(i18n.language);
    const timeFormat = getTimeFormatPreference();
    const timeFormatStr = timeFormat === '12h' ? 'p' : 'HH:mm';

    // Format: "Jan 1, 2025 at 2:00 PM"
    const startFormatted = format(startDate, `PPP`, { locale }) +
      ' ' + format(startDate, timeFormatStr, { locale });

    // No end date or same as start
    if (!endDateString || endDateString === startDateString) {
      return startFormatted;
    }

    const endDate = new Date(endDateString);

    if (isSameDay(startDate, endDate)) {
      // Same day: "Jan 1, 2025 at 2:00 PM - 5:00 PM"
      const endTimeFormatted = format(endDate, timeFormatStr, { locale });
      return `${startFormatted} - ${endTimeFormatted}`;
    } else {
      // Different days: "Jan 1, 2025 at 2:00 PM - Jan 2, 2025 at 5:00 PM"
      const endFormatted = format(endDate, `PPP`, { locale }) +
        ' ' + format(endDate, timeFormatStr, { locale });
      return `${startFormatted} - ${endFormatted}`;
    }
  } catch {
    return startDateString;
  }
}

/**
 * Hook that re-renders when date format preference changes
 */
export function useDateFormatListener() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('dateFormatChange', handler);
    return () => window.removeEventListener('dateFormatChange', handler);
  }, []);
}
