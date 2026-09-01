/**
 * TV Shows Client Component
 * 
 * Client-side component that handles infinite scrolling for TV show discovery.
 * Uses InfiniteScrollProvider to manage paginated data fetching.
 * Wrapped with ErrorBoundary for graceful error handling.
 */

'use client'

import { tvService } from '@/services/tmdb/tv.service'
import { InfiniteScrollProvider } from '@/providers/InfiniteScrollProvider'
import { InfiniteScrollWrapper } from '@/components/shared/InfiniteScrollWrapper'
import { MediaGrid } from '@/components/shared/MediaGrid'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import type{ NormalizedMediaItem } from '@/components/shared/MediaCard'

interface TVClientProps {
  initialItems: Array<{
    id: number
    title: string
    mediaType: string
    image: string | null
    rating: number
    year: string
  }>
  initialTotalPages: number
  filters: any
  includeAdult: boolean
}

/**
 * TVClient Component
 * 
 * @param initialItems - Pre-fetched TV show data for first page
 * @param initialTotalPages - Total number of pages available
 * @param filters - Discovery filters (genre, year, etc.)
 * @param includeAdult - Whether adult content is included
 */
export function TVClient({
  initialItems,
  initialTotalPages,
  filters,
  includeAdult,
}: TVClientProps) {
  /**
   * Fetches TV shows for a specific page
   * 
   * @param page - Page number to fetch
   * @returns Formatted TV show data with pagination info
   * @throws Error if TMDB response is invalid
   */
  const fetchTV = async (page: number) => {
    try {
      const response = await tvService.getDiscover({ ...filters, page })
      
      if (!response || !Array.isArray(response.results)) {
        throw new Error('Invalid response structure from TMDB')
      }
      
      return {
        results: response.results.map((item) => ({
          id: item.id,
          title: item.name,
          mediaType: 'tv' as const,
          image: item.poster_path,
          rating: item.vote_average,
          year: item.first_air_date?.split('-')[0] || 'N/A',
        })),
        total_pages: response.total_pages,
      }
    } catch (error) {
      console.error('[TV Fetch Error]:', error)
      throw error
    }
  }

  return (
    <ErrorBoundary>
      <InfiniteScrollProvider
        queryKey={['tv', 'infinite', JSON.stringify(filters)]}
        fetchFn={fetchTV}
        initialData={initialItems}
        initialTotalPages={initialTotalPages}
      >
        <InfiniteScrollWrapper
          emptyMessage={`No TV shows found${includeAdult ? ' with adult content' : ''}`}
        >
          {(items) => (
            <MediaGrid items={items as NormalizedMediaItem[]} />
          )}
        </InfiniteScrollWrapper>
      </InfiniteScrollProvider>
    </ErrorBoundary>
  )
}