import type { Wedding } from '@/features/weddings/types';

/**
 * French demo wedding: Emma & Louis
 * A romantic French wedding at Château de Chantilly
 */
export const DEMO_WEDDING_FR: Wedding = {
  id: 'demo',
  title: 'Emma & Louis',
  slug: 'demo',
  date: '2026-08-15T14:00:00Z',
  location: 'Château de Chantilly, Oise',
  customDomain: null,
  isPublished: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-31T00:00:00Z',
  userId: 'demo-user',
};

export const DEMO_WEDDING_PUBLIC_FR = {
  id: 'demo',
  title: 'Emma & Louis',
  slug: 'demo',
  date: '2026-08-15T14:00:00Z',
  location: 'Château de Chantilly, Oise',
};
