import { QueryClient } from '@tanstack/react-query';

// Create a QueryClient with sensible defaults for mobile apps
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Avoid refetching when navigating between screens in mobile apps
      refetchOnWindowFocus: false,
      // How many times to retry a failed request
      retry: 1,
      // How long data is considered fresh (1 minute)
      staleTime: 1000 * 60,
      // Cache time before GC (5 minutes)
      cacheTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
