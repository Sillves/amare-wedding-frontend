import type { Wedding } from '@/features/weddings/types';

/**
 * English demo wedding: Emma & James
 * A romantic English countryside wedding at Willowbrook Manor
 */
export const DEMO_WEDDING_EN: Wedding = {
  id: 'demo',
  title: 'Emma & James',
  slug: 'demo',
  date: '2026-08-15T14:00:00Z',
  location: 'Willowbrook Manor, Cotswolds, England',
  customDomain: null,
  isPublished: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-31T00:00:00Z',
  userId: 'demo-user',
};

export const DEMO_WEDDING_PUBLIC_EN = {
  id: 'demo',
  title: 'Emma & James',
  slug: 'demo',
  date: '2026-08-15T14:00:00Z',
  location: 'Willowbrook Manor, Cotswolds, England',
};
