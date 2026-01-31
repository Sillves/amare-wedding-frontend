import type { EventDto } from '@/features/weddings/types';

/**
 * Demo events for Emma & James's wedding weekend
 * 4 events spanning August 14-16, 2026
 */
export const DEMO_EVENTS: EventDto[] = [
  {
    id: 'event-1',
    name: 'Welcome Drinks',
    startDate: '2026-08-14T18:00:00Z',
    endDate: '2026-08-14T21:00:00Z',
    location: 'The Garden Terrace, Willowbrook Manor',
    description: 'Join us for cocktails and light bites as we kick off our wedding weekend. A casual evening to reconnect with friends and family before the big day.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
  {
    id: 'event-2',
    name: 'Wedding Ceremony',
    startDate: '2026-08-15T14:00:00Z',
    endDate: '2026-08-15T15:00:00Z',
    location: 'The Rose Garden, Willowbrook Manor',
    description: 'We invite you to witness our marriage vows in the beautiful rose garden. Please be seated by 13:45.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
  {
    id: 'event-3',
    name: 'Reception & Dinner',
    startDate: '2026-08-15T16:00:00Z',
    endDate: '2026-08-15T23:00:00Z',
    location: 'The Grand Ballroom, Willowbrook Manor',
    description: 'Celebrate with us! Enjoy a delicious dinner, heartfelt speeches, and dancing the night away.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
  {
    id: 'event-4',
    name: 'Farewell Brunch',
    startDate: '2026-08-16T10:00:00Z',
    endDate: '2026-08-16T13:00:00Z',
    location: 'The Orangery, Willowbrook Manor',
    description: 'One last gathering before we say goodbye. Join us for a relaxed brunch with fresh pastries, coffee, and good company.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
];
