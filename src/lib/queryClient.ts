import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minuten - data blijft "fresh"
      gcTime: 1000 * 60 * 10, // 10 minuten - cache tijd (was cacheTime)
      retry: 1, // Retry 1x bij failure
      refetchOnWindowFocus: false, // Niet automatisch refetchen bij window focus
    },
    mutations: {
      retry: 0, // Geen retry bij mutations
    },
  },
});
