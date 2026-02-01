import type { EventDto } from '@/features/weddings/types';

/**
 * French demo events for Emma & Louis's wedding weekend
 * 4 events spanning August 14-16, 2026
 */
export const DEMO_EVENTS_FR: EventDto[] = [
  {
    id: 'event-1',
    name: 'Cocktail de bienvenue',
    startDate: '2026-08-14T18:00:00Z',
    endDate: '2026-08-14T21:00:00Z',
    location: 'La Terrasse du Jardin, Château de Chantilly',
    description: 'Rejoignez-nous pour un cocktail et des amuse-bouches pour lancer notre week-end de mariage. Une soirée décontractée pour retrouver amis et famille.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
  {
    id: 'event-2',
    name: 'Cérémonie de mariage',
    startDate: '2026-08-15T14:00:00Z',
    endDate: '2026-08-15T15:00:00Z',
    location: 'La Roseraie, Château de Chantilly',
    description: 'Nous vous invitons à être témoins de nos vœux de mariage dans la magnifique roseraie. Merci de prendre place avant 13h45.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
  {
    id: 'event-3',
    name: 'Réception & Dîner',
    startDate: '2026-08-15T16:00:00Z',
    endDate: '2026-08-15T23:00:00Z',
    location: 'La Grande Salle de Bal, Château de Chantilly',
    description: 'Célébrez avec nous ! Savourez un délicieux dîner, des discours émouvants et dansez toute la nuit.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
  {
    id: 'event-4',
    name: 'Brunch d\'au revoir',
    startDate: '2026-08-16T10:00:00Z',
    endDate: '2026-08-16T13:00:00Z',
    location: 'L\'Orangerie, Château de Chantilly',
    description: 'Un dernier moment ensemble avant de se dire au revoir. Rejoignez-nous pour un brunch détendu avec viennoiseries fraîches, café et bonne compagnie.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
];
