/**
 * Watchlist Client Component
 * 
 * Client-side component that displays the user's watchlist.
 * Uses useWatchlist hook for real-time data with optimistic updates.
 * Falls back to server-side initial data while client state loads.
 */

'use client'

import { useWatchlist } from '@/hooks/useWatchlist'
import { MediaGrid } from '@/components/shared/MediaGrid'
import { Loader2 } from 'lucide-react'

interface WatchlistClientProps {
  initialItems: Array<{
    id: string
    mediaId: number
    mediaType: 'movie' | 'tv'
    title: string
    poster: string | null
    rating: number
    year: string
    addedAt: Date | string
  }>
}

/**
 * WatchlistClient Component
 * 
 * @param initialItems - Pre-fetched watchlist items from server
 */
export function WatchlistClient({ initialItems }: WatchlistClientProps) {
  const { watchlist, isLoading, error } = useWatchlist()

  // Use client data if available, otherwise fallback to initial data
  const items = watchlist.length > 0 ? watchlist : initialItems

  // Transform items to match MediaGrid expectations
  const gridItems = items.map((item) => {
    // Parse rating to number
    const parsedRating = typeof item.rating === 'string'
      ? parseFloat(item.rating)
      : Number(item.rating || 0);

    // Normalize media type to valid values
    let finalizedMediaType: 'movie' | 'tv' = 'movie';
    if (item.mediaType) {
      const lowerType = item.mediaType.toLowerCase();
      if (lowerType === 'movie' || lowerType === 'tv') {
        finalizedMediaType = lowerType;
      }
    }

    return {
      id: item.mediaId || Number(item.id),
      title: item.title,
      poster: item.poster,
      rating: isNaN(parsedRating) ? 0 : parsedRating,
      year: item.year || 'N/A',
      mediaType: finalizedMediaType,
    };
  })

  // Show loading state while data is being fetched
  if (isLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Show error state if fetch fails
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Failed to load watchlist</p>
      </div>
    )
  }

  // Show empty state if watchlist has no items
  if (gridItems.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">Your watchlist is empty</p>
        <p className="text-muted-foreground text-sm mt-2">
          Start adding movies and TV shows you want to watch later!
        </p>
      </div>
    )
  }

  return <MediaGrid items={gridItems} />
}