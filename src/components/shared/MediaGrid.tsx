/**
 * Media Grid Component
 * 
 * Displays a grid of media cards with loading, error, and empty states.
 * Deduplicates items by ID to prevent duplicate renders.
 * Supports movies, TV shows, and people with appropriate card rendering.
 */

'use client'

import { MediaCard, NormalizedMediaItem } from './MediaCard'
import { LoadingSkeleton } from './LoadingSkeleton'
import { ErrorMessage } from './ErrorMessage'
import { dedupeById } from '@/lib/dedupe-helpers'
import { UniversalMediaType } from '@/types'

interface MediaGridProps {
  items: NormalizedMediaItem[]
  loading?: boolean
  error?: Error | null
  mediaType?: UniversalMediaType
}

/**
 * MediaGrid Component
 * 
 * @param items - Array of media items to display
 * @param loading - Whether data is currently loading
 * @param error - Error object if fetch failed
 * @param mediaType - Default media type for items without type
 * @returns Rendered media grid with appropriate state
 */
export function MediaGrid({ items, loading, error, mediaType }: MediaGridProps) {
  // Loading state with skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <LoadingSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    )
  }

  // Error state
  if (error) return <ErrorMessage message={error.message} />

  // Empty state
  if (!items || items.length === 0) {
    return <p className="text-gray-500 text-center py-12">No items found.</p>
  }

  // Deduplicate items by ID
  const uniqueItems = dedupeById(items)

  return (
    <div className="mgrid gap-4 min-h-screen h-auto">
      {uniqueItems.map((item) => (
        <MediaCard 
          key={`${item?.mediaType || mediaType}-${item?.id}`} 
          {...item} 
          className="h-92" 
        />
      ))}
    </div>
  )
}