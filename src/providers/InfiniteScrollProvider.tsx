/**
 * Infinite Scroll Provider
 * 
 * React context provider for infinite scrolling with React Query.
 * Manages paginated data fetching with automatic next page loading.
 * Provides items, loading states, and pagination controls to child components.
 */

'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

interface InfiniteScrollContextValue<T> {
  items: T[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  error: Error | null
  fetchNextPage: () => void
  refetch: () => void
  totalItems: number
}

const InfiniteScrollContext = createContext<InfiniteScrollContextValue<any> | null>(null)

interface InfiniteScrollProviderProps<T> {
  children: ReactNode
  queryKey: unknown[]
  fetchFn: (page: number) => Promise<{ results: T[]; total_pages: number }>
  initialData: T[]
  initialTotalPages: number
  enabled?: boolean
  staleTime?: number
}

/**
 * InfiniteScrollProvider Component
 * 
 * @param children - Child components with access to infinite scroll context
 * @param queryKey - React Query cache key
 * @param fetchFn - Function to fetch data for a specific page
 * @param initialData - Initial data for first page
 * @param initialTotalPages - Total number of pages available
 * @param enabled - Whether the query is enabled
 * @param staleTime - Time in ms before data is considered stale
 * @returns Provider with infinite scroll context
 */
export function InfiniteScrollProvider<T>({
  children,
  queryKey,
  fetchFn,
  initialData,
  initialTotalPages,
  enabled = true,
  staleTime = 60 * 1000,
}: InfiniteScrollProviderProps<T>) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchFn(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.results || lastPage.results.length === 0) return undefined
      if (allPages.length >= (lastPage.total_pages || 0)) return undefined
      return allPages.length + 1
    },
    placeholderData: (previousData) => previousData,
    staleTime,
    enabled,
    initialData: {
      pages: [{ results: initialData, total_pages: initialTotalPages }],
      pageParams: [1],
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Flatten all pages into a single array
  const allItems = data?.pages.flatMap((page) => page.results || []) || []

  const value: InfiniteScrollContextValue<T> = {
    items: allItems,
    isLoading,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    error: error as Error | null,
    fetchNextPage,
    refetch,
    totalItems: allItems.length,
  }

  return (
    <InfiniteScrollContext.Provider value={value}>
      {children}
    </InfiniteScrollContext.Provider>
  )
}

/**
 * Hook to access infinite scroll context
 * 
 * @returns Infinite scroll context value
 * @throws Error if used outside InfiniteScrollProvider
 */
export function useInfiniteScrollContext<T>() {
  const context = useContext(InfiniteScrollContext)
  if (!context) {
    throw new Error('useInfiniteScrollContext must be used within InfiniteScrollProvider')
  }
  return context as InfiniteScrollContextValue<T>
}