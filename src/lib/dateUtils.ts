import { getIntlLocale } from './dateLocale';
import { getTimeFormatPreference } from '@/hooks/useDateFormat';

/**
 * Check if two date strings represent the same calendar day
 */
export function isSameDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Format a date string as short date (e.g., "Jan 5")
 */
export function formatShortDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  const intlLocale = getIntlLocale(locale);
  return date.toLocaleDateString(intlLocale, {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date string as time, respecting user's time format preference
 */
export function formatTimeWithPreference(dateString: string, locale: string): string {
  const date = new Date(dateString);
  const intlLocale = getIntlLocale(locale);
  const timeFormatPref = getTimeFormatPreference();

  return date.toLocaleTimeString(intlLocale, {
    hour: timeFormatPref === '24h' ? '2-digit' : 'numeric',
    minute: '2-digit',
    hour12: timeFormatPref === '12h',
  });
}

/**
 * Format end date/time intelligently:
 * - If same day as start: show only time (e.g., "18:00")
 * - If different day: show date + time (e.g., "Jan 5 18:00")
 */
export function formatEndDateTime(
  startDate: string,
  endDate: string,
  locale: string
): string {
  if (isSameDay(startDate, endDate)) {
    return formatTimeWithPreference(endDate, locale);
  }
  return `${formatShortDate(endDate, locale)} ${formatTimeWithPreference(endDate, locale)}`;
}
