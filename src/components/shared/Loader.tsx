/**
 * Loader Component
 * 
 * Intersection observer-based loader for infinite scrolling.
 * Triggers load more when the loader element becomes visible.
 * Shows different states: loading, scroll trigger, and end message.
 */

'use client'

import { useEffect, useRef } from 'react'

interface LoaderProps {
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

/**
 * Loader Component
 * 
 * @param isLoading - Whether data is currently being fetched
 * @param hasMore - Whether more data is available
 * @param onLoadMore - Callback to fetch next page
 * @returns Rendered loader with intersection observer
 */
export function Loader({ isLoading, hasMore, onLoadMore }: LoaderProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  // End of results
  if (!hasMore) {
    return (
      <div className="text-center text-gray-500 py-8">
        You've reached the end!
      </div>
    )
  }

  // Loader trigger
  return (
    <div ref={ref} className="loader-cnt text-center py-8">
      {isLoading ? (
        <div className="flex justify-center items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">Loading more...</span>
        </div>
      ) : (
        <span className="text-gray-400">Scroll for more</span>
      )}
    </div>
  )
}