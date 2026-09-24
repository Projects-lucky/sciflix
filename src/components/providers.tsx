/**
 * App Providers
 * Wraps the app with:
 * - NuqsAdapter (URL state management)
 * - QueryClientProvider (server state management)
 *
 * Order matters: QueryClientProvider first, NuqsAdapter second
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { useState } from 'react';

// ============================================
// COMPONENT
// ============================================

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create query client once per browser session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,        // Data is fresh for 1 minute
            gcTime: 5 * 60 * 1000,       // Cache lives 5 minutes after last use
            refetchOnWindowFocus: false, // Don't refetch on tab switch
            refetchOnReconnect: false,   // Don't refetch on network recovery
            retry: 1,                    // Retry failed requests once
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>{children}</NuqsAdapter>
    </QueryClientProvider>
  );
}