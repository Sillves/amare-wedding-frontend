import type { GuestDto, RsvpStatus } from '@/features/weddings/types';

/**
 * English demo guests for Emma & James's wedding
 * 15 guests with varied RSVP statuses
 */
export const DEMO_GUESTS_EN: GuestDto[] = [
  // Confirmed guests (6)
  {
    id: 'guest-1',
    name: 'Sarah Thompson',
    email: 'sarah.thompson@email.com',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-3',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-4',
    name: 'David Williams',
    email: 'david.w@email.com',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-5',
    name: 'Margaret Hartley',
    email: 'margaret.hartley@email.com',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-6',
    name: 'Robert Mitchell',
    email: 'robert.mitchell@email.com',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },

  // Pending guests (5)
  {
    id: 'guest-7',
    name: 'Oliver Brown',
    email: 'oliver.b@email.com',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-20T14:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-8',
    name: 'Sophie Taylor',
    email: 'sophie.taylor@email.com',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-20T14:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-9',
    name: 'Emily Johnson',
    email: 'emily.j@email.com',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-20T14:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-10',
    name: 'Charlotte White',
    email: null,
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: null,
    weddingId: 'demo',
  },
  {
    id: 'guest-11',
    name: 'Benjamin Moore',
    email: 'ben.moore@email.com',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-25T09:00:00Z',
    weddingId: 'demo',
  },

  // Declined guests (2)
  {
    id: 'guest-12',
    name: 'Thomas Wright',
    email: 'thomas.wright@email.com',
    rsvpStatus: 2 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-13',
    name: 'Jessica Davis',
    email: 'jessica.davis@email.com',
    rsvpStatus: 2 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },

  // Maybe guests (2)
  {
    id: 'guest-14',
    name: 'William Harris',
    email: 'will.harris@email.com',
    rsvpStatus: 3 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-15',
    name: 'Grace Martin',
    email: 'grace.m@email.com',
    rsvpStatus: 3 as RsvpStatus,
    preferredLanguage: 'en',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
];
