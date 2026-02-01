import { AxiosError } from 'axios';
import i18n from '@/lib/i18n';

/**
 * API Error Response structure from the backend
 */
interface ApiError {
  code: string;
  message: string;
}

interface ApiErrorResponse {
  errors?: ApiError[];
  error?: string; // Some endpoints return a simple error string
}

/**
 * Error codes returned by the backend API
 * Maps to HTTP status codes as follows:
 * - validation → 400 (BadRequest)
 * - not_found → 404 (NotFound)
 * - unauthorized → 401 (Unauthorized)
 * - forbidden → 403 (Forbidden)
 * - conflict → 409 (Conflict)
 * - limit_exceeded → 403 (Forbidden)
 * - external_failure → 502 (BadGateway)
 * - unexpected → 500 (InternalServerError)
 */
export type ErrorCode =
  | 'validation'
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'limit_exceeded'
  | 'external_failure'
  | 'unexpected';

/**
 * Mapping of backend error messages to translation keys
 * This allows us to display localized error messages
 */
const errorMessageToTranslationKey: Record<string, string> = {
  // Authentication
  'Invalid credentials': 'errors.auth.invalidCredentials',
  'Registration failed': 'errors.auth.registrationFailed',
  'Registration is disabled': 'errors.auth.registrationDisabled',
  'Invalid registration code': 'errors.auth.invalidRegistrationCode',
  'User not found.': 'errors.auth.userNotFound',

  // Guest errors
  'Guest name is required': 'errors.guests.nameRequired',
  'Guest email is required': 'errors.guests.emailRequired',
  'Guest email is not valid': 'errors.guests.emailInvalid',
  'Guest language is not supported': 'errors.guests.languageNotSupported',
  'Guest not found': 'errors.guests.notFound',
  'Guest does not belong to this wedding': 'errors.guests.wrongWedding',
  'Failed to send invitation email': 'errors.guests.invitationFailed',

  // Event errors
  'Event name is required': 'errors.events.nameRequired',
  'Event location is required': 'errors.events.locationRequired',
  'Event start date is required': 'errors.events.startDateRequired',
  'Event end date is required': 'errors.events.endDateRequired',
  'Event end date must be on or after start date': 'errors.events.endDateBeforeStart',
  'Event not found': 'errors.events.notFound',
  'Not allowed to modify this event': 'errors.events.notAllowed',
  'Guest already in event; cannot add.': 'errors.events.guestAlreadyInEvent',
  'Guest not in event; cannot remove.': 'errors.events.guestNotInEvent',

  // Expense errors
  'Expense amount must be greater than 0': 'errors.expenses.amountRequired',
  'Expense description is required': 'errors.expenses.descriptionRequired',
  'Expense description must not exceed 500 characters': 'errors.expenses.descriptionTooLong',
  'Expense notes must not exceed 1000 characters': 'errors.expenses.notesTooLong',

  // Wedding errors
  'Wedding not found': 'errors.weddings.notFound',
  'Invalid wedding ID': 'errors.weddings.invalidId',

  // Wedding user errors
  'User is already added to this wedding': 'errors.weddings.userAlreadyAdded',
  'User is not part of this wedding': 'errors.weddings.userNotInWedding',

  // Subscription/Billing errors
  'Free tier does not require checkout.': 'errors.billing.freeNoCheckout',
  'Stripe price mapping not found.': 'errors.billing.priceNotFound',
  'Stripe did not return a checkout URL.': 'errors.billing.checkoutFailed',
  'No Stripe customer found for this user.': 'errors.billing.noCustomer',
  'Stripe did not return a portal URL.': 'errors.billing.portalFailed',
  'Lifetime plans must be purchased through checkout.': 'errors.billing.lifetimeCheckout',
  'Free tier does not require a paid subscription.': 'errors.billing.freeNoPaid',
  'No active subscription found to update.': 'errors.billing.noActiveSubscription',
  'Stripe subscription items not found.': 'errors.billing.subscriptionItemsNotFound',
  'Invalid Stripe signature.': 'errors.billing.invalidSignature',
  'Failed to update subscription details.': 'errors.billing.updateFailed',

  // Website errors
  'Website not found for this wedding': 'errors.website.notFound',
  'Website builder is only available for Starter and Pro subscriptions': 'errors.website.subscriptionRequired',
  'Website already exists for this wedding': 'errors.website.alreadyExists',
  'Website not found': 'errors.website.notFound',
  'Website not found or not published': 'errors.website.notPublished',

  // Media errors
  'Invalid media ID': 'errors.media.invalidId',
  'Media not found': 'errors.media.notFound',
};

/**
 * Patterns for dynamic error messages that contain variables
 */
const errorPatterns: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /^Guest with id .+ not found$/, key: 'errors.guests.notFoundWithId' },
  { pattern: /^A guest with email .+ already exists for this wedding$/, key: 'errors.guests.emailExists' },
  { pattern: /^Guest not found for the provided email$/, key: 'errors.guests.notFoundByEmail' },
  { pattern: /^Guests not found: .+$/, key: 'errors.guests.someNotFound' },
  { pattern: /^Event with id .+ not found$/, key: 'errors.events.notFoundWithId' },
  { pattern: /^Event with name .+ not found$/, key: 'errors.events.notFoundByName' },
  { pattern: /^Event or guest not found$/, key: 'errors.events.eventOrGuestNotFound' },
  { pattern: /^Expense with id .+ not found$/, key: 'errors.expenses.notFoundWithId' },
  { pattern: /^Wedding with id .+ not found$/, key: 'errors.weddings.notFoundWithId' },
  { pattern: /^Wedding .+ not found$/, key: 'errors.weddings.notFoundBySlug' },
  { pattern: /^Guest limit reached for the .+ plan\.$/, key: 'errors.limits.guestLimitReached' },
  { pattern: /^Event limit reached for the .+ plan\.$/, key: 'errors.limits.eventLimitReached' },
  { pattern: /^Monthly email limit reached for the .+ plan\.$/, key: 'errors.limits.emailLimitReached' },
];

/**
 * Get translation key for an error message
 */
function getTranslationKey(message: string): string | null {
  // First check exact matches
  if (errorMessageToTranslationKey[message]) {
    return errorMessageToTranslationKey[message];
  }

  // Then check patterns
  for (const { pattern, key } of errorPatterns) {
    if (pattern.test(message)) {
      return key;
    }
  }

  return null;
}

/**
 * Get a user-friendly error message from an API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    // Check for structured error response
    if (data?.errors && data.errors.length > 0) {
      const messages = data.errors.map((err) => {
        const translationKey = getTranslationKey(err.message);
        if (translationKey && i18n.exists(translationKey)) {
          return i18n.t(translationKey);
        }
        // Fall back to the original message if no translation found
        return err.message;
      });
      return messages.join('. ');
    }

    // Check for simple error string
    if (data?.error) {
      const translationKey = getTranslationKey(data.error);
      if (translationKey && i18n.exists(translationKey)) {
        return i18n.t(translationKey);
      }
      return data.error;
    }

    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 400:
        return i18n.t('errors.http.badRequest');
      case 401:
        return i18n.t('errors.http.unauthorized');
      case 403:
        return i18n.t('errors.http.forbidden');
      case 404:
        return i18n.t('errors.http.notFound');
      case 409:
        return i18n.t('errors.http.conflict');
      case 413:
        return i18n.t('errors.http.tooLarge');
      case 429:
        return i18n.t('errors.http.tooManyRequests');
      case 500:
        return i18n.t('errors.http.serverError');
      case 502:
        return i18n.t('errors.http.badGateway');
      default:
        break;
    }

    // Network errors
    if (error.code === 'ECONNABORTED') {
      return i18n.t('errors.network.timeout');
    }
    if (error.code === 'ERR_NETWORK') {
      return i18n.t('errors.network.offline');
    }
  }

  // Generic error
  if (error instanceof Error) {
    return error.message;
  }

  return i18n.t('errors.generic');
}

/**
 * Get error code from an API error
 */
export function getErrorCode(error: unknown): ErrorCode | null {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.errors && data.errors.length > 0) {
      return data.errors[0].code as ErrorCode;
    }
  }
  return null;
}

/**
 * Check if error is a specific type
 */
export function isErrorCode(error: unknown, code: ErrorCode): boolean {
  return getErrorCode(error) === code;
}
