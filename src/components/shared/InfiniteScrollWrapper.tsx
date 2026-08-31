/**
 * Infinite Scroll Wrapper Component
 * 
 * Wraps content with infinite scroll functionality.
 * Handles loading, error, and empty states.
 * Displays result count and triggers loading of next page.
 */

'use client'

import { ReactNode } from 'react'
import { useInfiniteScrollContext } from '@/providers/InfiniteScrollProvider'
import { Loader } from './Loader'
import { ErrorBoundary } from './ErrorBoundary'

interface InfiniteScrollWrapperProps<T> {
  children: (items: T[]) => ReactNode
  emptyMessage?: string
  loadingComponent?: ReactNode
}

/**
 * InfiniteScrollWrapper Component
 * 
 * @param children - Render function that receives items array
 * @param emptyMessage - Message shown when no items available
 * @param loadingComponent - Custom loading UI
 * @returns Rendered wrapper with infinite scroll functionality
 */
export function InfiniteScrollWrapper<T>({
  children,
  emptyMessage = 'No items found',
  loadingComponent,
}: InfiniteScrollWrapperProps<T>) {
  const {
    items,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    fetchNextPage,
    refetch,
    totalItems,
  } = useInfiniteScrollContext<T>()

  // Loading state
  if (isLoading && items.length === 0) {
    return loadingComponent || (
      <div className="loading-state-cnt text-center py-8">
        <div className="inline-block w-8 h-8 border-4 border-red-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-2 text-gray-400">Loading...</p>
      </div>
    )
  }

  // Error state with retry
  if (error) {
    return (
      <div className="error-state-cnt text-center py-12">
        <p className="text-red-500 text-lg">⚠️ {error.message || 'Failed to load data'}</p>
        <button
          onClick={() => refetch()}
          className="try-again-btn mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      {/* Result count */}
      <p className="text-red-primary text-md w-auto p-1.5 font-tektur mb-4">
        Showing {totalItems} results
      </p>

      {/* Render children with items */}
      {children(items)}

      {/* Loader at bottom */}
      <Loader
        isLoading={isFetchingNextPage}
        hasMore={hasNextPage}
        onLoadMore={fetchNextPage}
      />
    </>
  )
}