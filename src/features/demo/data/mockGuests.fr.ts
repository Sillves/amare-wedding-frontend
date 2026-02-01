import type { GuestDto, RsvpStatus } from '@/features/weddings/types';

/**
 * French demo guests for Emma & Louis's wedding
 * 15 guests with varied RSVP statuses
 */
export const DEMO_GUESTS_FR: GuestDto[] = [
  // Confirmed guests (6)
  {
    id: 'guest-1',
    name: 'Sophie Dubois',
    email: 'sophie.dubois@email.fr',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-2',
    name: 'Pierre Martin',
    email: 'pierre.martin@email.fr',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-3',
    name: 'Marie Lefebvre',
    email: 'marie.lefebvre@email.fr',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-4',
    name: 'Jean Moreau',
    email: 'jean.moreau@email.fr',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-5',
    name: 'Isabelle Bernard',
    email: 'isabelle.bernard@email.fr',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-6',
    name: 'François Petit',
    email: 'francois.petit@email.fr',
    rsvpStatus: 1 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },

  // Pending guests (5)
  {
    id: 'guest-7',
    name: 'Thomas Roux',
    email: 'thomas.roux@email.fr',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-20T14:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-8',
    name: 'Camille Fournier',
    email: 'camille.fournier@email.fr',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-20T14:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-9',
    name: 'Nicolas Girard',
    email: 'nicolas.girard@email.fr',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-20T14:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-10',
    name: 'Claire Bonnet',
    email: null,
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: null,
    weddingId: 'demo',
  },
  {
    id: 'guest-11',
    name: 'Antoine Mercier',
    email: 'antoine.mercier@email.fr',
    rsvpStatus: 0 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-25T09:00:00Z',
    weddingId: 'demo',
  },

  // Declined guests (2)
  {
    id: 'guest-12',
    name: 'Guillaume Laurent',
    email: 'guillaume.laurent@email.fr',
    rsvpStatus: 2 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-13',
    name: 'Aurélie Simon',
    email: 'aurelie.simon@email.fr',
    rsvpStatus: 2 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },

  // Maybe guests (2)
  {
    id: 'guest-14',
    name: 'Julien Leroy',
    email: 'julien.leroy@email.fr',
    rsvpStatus: 3 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
  {
    id: 'guest-15',
    name: 'Mathilde David',
    email: 'mathilde.david@email.fr',
    rsvpStatus: 3 as RsvpStatus,
    preferredLanguage: 'fr',
    invitationSentAt: '2026-02-15T10:00:00Z',
    weddingId: 'demo',
  },
];
