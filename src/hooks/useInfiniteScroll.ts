/**
 * useInfiniteScroll Hook
 * 
 * Custom hook for managing infinite scrolling pagination.
 * Handles loading states, error handling, and pagination state.
 * Resets when initial data changes (e.g., new filters applied).
 */

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions<T> {
  fetchFn: (page: number) => Promise<{ results: T[]; total_pages: number }>
  initialData: T[]
  initialTotalPages: number
  enabled?: boolean
}

/**
 * useInfiniteScroll Hook
 * 
 * @param fetchFn - Async function to fetch data for a specific page
 * @param initialData - Initial data for first page
 * @param initialTotalPages - Total number of pages available
 * @param enabled - Whether infinite scroll is enabled
 * @returns Items, loading state, and load more function
 */
export function useInfiniteScroll<T>({
  fetchFn,
  initialData,
  initialTotalPages,
  enabled = true,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialData)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(page < initialTotalPages)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Loads the next page of data
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || !enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const nextPage = page + 1
      const data = await fetchFn(nextPage)
      
      setItems((prev) => [...prev, ...data.results])
      setPage(nextPage)
      setTotalPages(data.total_pages)
      setHasMore(nextPage < data.total_pages)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [page, hasMore, isLoading, enabled, fetchFn])

  // Reset when initial data changes (e.g., new filters)
  useEffect(() => {
    setItems(initialData)
    setPage(1)
    setTotalPages(initialTotalPages)
    setHasMore(1 < initialTotalPages)
    setError(null)
  }, [initialData, initialTotalPages])

  return {
    items,
    isLoading,
    hasMore,
    error,
    loadMore,
    setItems,
    totalItems: items.length,
  }
}