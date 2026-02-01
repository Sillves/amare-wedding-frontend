import type { EventDto } from '@/features/weddings/types';

/**
 * Dutch demo events for Emma & Thijs's wedding weekend
 * 4 events spanning August 14-16, 2026
 */
export const DEMO_EVENTS_NL: EventDto[] = [
  {
    id: 'event-1',
    name: 'Welkomstborrel',
    startDate: '2026-08-14T18:00:00Z',
    endDate: '2026-08-14T21:00:00Z',
    location: 'Het Tuinterras, Kasteel de Haar',
    description: 'Kom gezellig proosten met ons aan de vooravond van ons huwelijk. Een informele avond om bij te praten met vrienden en familie.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
  {
    id: 'event-2',
    name: 'Huwelijksceremonie',
    startDate: '2026-08-15T14:00:00Z',
    endDate: '2026-08-15T15:00:00Z',
    location: 'De Rozentuin, Kasteel de Haar',
    description: 'Wij nodigen jullie uit om getuige te zijn van onze huwelijksgeloften in de prachtige rozentuin. Neem plaats om 13:45 uur.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
  {
    id: 'event-3',
    name: 'Receptie & Diner',
    startDate: '2026-08-15T16:00:00Z',
    endDate: '2026-08-15T23:00:00Z',
    location: 'De Balzaal, Kasteel de Haar',
    description: 'Vier met ons mee! Geniet van een heerlijk diner, mooie speeches en dans de hele avond mee.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
  {
    id: 'event-4',
    name: 'Afscheidsbrunch',
    startDate: '2026-08-16T10:00:00Z',
    endDate: '2026-08-16T13:00:00Z',
    location: 'De Orangerie, Kasteel de Haar',
    description: 'Een laatste samenzijn voordat we afscheid nemen. Schuif aan voor een ontspannen brunch met verse croissants, koffie en fijn gezelschap.',
    guestDtos: undefined,
    weddingId: 'demo',
  },
];
