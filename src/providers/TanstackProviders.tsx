/**
 * TanStack Query Provider
 * 
 * Client-side provider for React Query with optimized defaults.
 * Configures caching, retries, and stale time for all queries.
 * Includes React Query DevTools for development debugging.
 */

"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface TanstackProvidersProps {
  children: React.ReactNode
}

/**
 * TanstackProviders Component
 * 
 * @param children - Child components that will have access to React Query
 * @returns Query client provider with dev tools
 */
export function TanstackProviders({ children }: TanstackProvidersProps) {
  // Initialize QueryClient once with default options
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}