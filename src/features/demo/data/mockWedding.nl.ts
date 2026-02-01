import type { Wedding } from '@/features/weddings/types';

/**
 * Dutch demo wedding: Emma & Thijs
 * A romantic Dutch wedding at Kasteel de Haar
 */
export const DEMO_WEDDING_NL: Wedding = {
  id: 'demo',
  title: 'Emma & Thijs',
  slug: 'demo',
  date: '2026-08-15T14:00:00Z',
  location: 'Kasteel de Haar, Utrecht',
  customDomain: null,
  isPublished: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-31T00:00:00Z',
  userId: 'demo-user',
};

export const DEMO_WEDDING_PUBLIC_NL = {
  id: 'demo',
  title: 'Emma & Thijs',
  slug: 'demo',
  date: '2026-08-15T14:00:00Z',
  location: 'Kasteel de Haar, Utrecht',
};
