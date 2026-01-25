import type { RsvpStatus } from '@/features/weddings/types';

/**
 * Maps backend RSVP status (string or integer) to frontend integer enum
 * Backend may send either:
 * - Integers: 0, 1, 2, 3
 * - Strings: "Pending", "Accepted", "Declined", "Maybe"
 */
export function normalizeRsvpStatus(status: any): RsvpStatus {
  // If it's already a number, return as-is
  if (typeof status === 'number') {
    return status as RsvpStatus;
  }

  // If it's a string, map to integer
  if (typeof status === 'string') {
    const statusMap: Record<string, RsvpStatus> = {
      'Pending': 0,
      'Accepted': 1,
      'Declined': 2,
      'Maybe': 3,
      // Also support lowercase
      'pending': 0,
      'accepted': 1,
      'declined': 2,
      'maybe': 3,
    };

    return statusMap[status] ?? 0; // Default to Pending if unknown
  }

  // Default to Pending
  return 0;
}
