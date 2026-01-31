import { useParams, useLocation } from 'react-router-dom';

/**
 * Check if a wedding ID represents demo mode
 */
export const isDemoWeddingId = (id?: string): boolean => id === 'demo';

/**
 * Hook to check if currently in demo mode
 * Works with both URL params and path-based routing
 */
export function useDemoMode(): boolean {
  const { weddingId } = useParams<{ weddingId: string }>();
  const location = useLocation();

  // Check if we're on a demo route (path starts with /demo)
  if (location.pathname.startsWith('/demo')) {
    return true;
  }

  // Check if wedding ID in URL params is 'demo'
  return isDemoWeddingId(weddingId);
}

/**
 * Get the demo wedding ID constant
 */
export const DEMO_WEDDING_ID = 'demo';
