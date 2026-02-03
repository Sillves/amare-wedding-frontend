import { enUS, nl, fr, Locale } from 'date-fns/locale';

/**
 * Map i18n language codes to date-fns locales
 */
export const dateFnsLocaleMap: Record<string, Locale> = {
  en: enUS,
  nl: nl,
  fr: fr,
};

/**
 * Map i18n language codes to Intl locale strings
 */
export const intlLocaleMap: Record<string, string> = {
  en: 'en-US',
  nl: 'nl-NL',
  fr: 'fr-FR',
};

/**
 * Get date-fns locale from i18n language code
 * @param language - i18n language code (e.g., 'en', 'nl', 'fr')
 * @returns date-fns Locale object
 */
export function getDateFnsLocale(language: string): Locale {
  return dateFnsLocaleMap[language] || enUS;
}

/**
 * Get Intl locale string from i18n language code
 * @param language - i18n language code (e.g., 'en', 'nl', 'fr')
 * @returns Intl locale string (e.g., 'en-US', 'nl-NL', 'fr-FR')
 */
export function getIntlLocale(language: string): string {
  return intlLocaleMap[language] || 'en-US';
}
