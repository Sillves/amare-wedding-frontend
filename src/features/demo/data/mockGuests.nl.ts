import type { GuestDto, RsvpStatus } from '@/features/weddings/types';

/**
 * Dutch demo guests for Emma & Thijs's wedding
 * 15 guests with varied RSVP statuses
 */
export const DEMO_GUESTS_NL: GuestDto[] = [
  // Confirmed guests (6)
  {
    id: 'guest-1',
    name: 'Sophie de Vries',
    email: 'sophie.devries@email.nl',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-2',
    name: 'Pieter Bakker',
    email: 'pieter.bakker@email.nl',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-3',
    name: 'Lisa Jansen',
    email: 'lisa.jansen@email.nl',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-4',
    name: 'Jan van den Berg',
    email: 'jan.vdberg@email.nl',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-5',
    name: 'Maria Visser',
    email: 'maria.visser@email.nl',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-6',
    name: 'Henk Smit',
    email: 'henk.smit@email.nl',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },

  // Pending guests (5)
  {
    id: 'guest-7',
    name: 'Thomas Mulder',
    email: 'thomas.mulder@email.nl',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-20T14:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-8',
    name: 'Anne de Groot',
    email: 'anne.degroot@email.nl',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-20T14:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-9',
    name: 'Kees Vermeer',
    email: 'kees.vermeer@email.nl',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-20T14:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-10',
    name: 'Els van Dijk',
    email: null,
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: null,
    weddingId: 'demo',
  },
  {
    id: 'guest-11',
    name: 'Bram Koning',
    email: 'bram.koning@email.nl',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-25T09:00:00Z',
    weddingId: 'demo',
  },

  // Declined guests (2)
  {
    id: 'guest-12',
    name: 'Wouter Bos',
    email: 'wouter.bos@email.nl',
    rsvpStatus: 2 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-13',
    name: 'Marloes Peters',
    email: 'marloes.peters@email.nl',
    rsvpStatus: 2 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },

  // Maybe guests (2)
  {
    id: 'guest-14',
    name: 'Daan Willems',
    email: 'daan.willems@email.nl',
    rsvpStatus: 3 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-15',
    name: 'Femke van Leeuwen',
    email: 'femke.vl@email.nl',
    rsvpStatus: 3 as RsvpStatus,
    preferredLanguage: 'nl',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
];
