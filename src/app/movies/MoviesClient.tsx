/**
 * Movies Client Component
 * 
 * Client-side component that handles infinite scrolling for movie discovery.
 * Uses the InfiniteScrollProvider to manage paginated data fetching.
 * Wrapped with ErrorBoundary for graceful error handling.
 */

'use client'

import { moviesService } from '@/services/tmdb/movies.service'
import { InfiniteScrollProvider } from '@/providers/InfiniteScrollProvider'
import { InfiniteScrollWrapper } from '@/components/shared/InfiniteScrollWrapper'
import { MediaGrid } from '@/components/shared/MediaGrid'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { trackRequest } from '@/lib/toast-events'
import type{ NormalizedMediaItem } from '@/components/shared/MediaCard'

interface MoviesClientProps {
  initialItems: Array<{
    id: number
    title: string
    image: string | null
    rating: number
    year: string
  }>
  initialTotalPages: number
  filters: any
  includeAdult: boolean
}

/**
 * MoviesClient Component
 * 
 * @param initialItems - Pre-fetched movie data for first page
 * @param initialTotalPages - Total number of pages available
 * @param filters - Discovery filters (genre, year, etc.)
 * @param includeAdult - Whether adult content is included
 */
export function MoviesClient({
  initialItems,
  initialTotalPages,
  filters,
  includeAdult,
}: MoviesClientProps) {
  /**
   * Fetches movies for a specific page
   * 
   * @param page - Page number to fetch
   * @returns Formatted movie data with pagination info
   * @throws Error if TMDB response is invalid
   */
  const fetchMovies = async (page: number) => {
    try {
      const response = await trackRequest(moviesService.getDiscover({ ...filters, page }))
      
      if (!response || !Array.isArray(response.results)) {
        throw new Error('Invalid response structure from TMDB')
      }
      
      return {
        results: response.results.map((item) => ({
          id: item.id,
          title: item.title,
          mediaType: 'movie' as const,
          image: item.poster_path,
          rating: item.vote_average,
          year: item.release_date?.split('-')[0] || 'N/A',
        })),
        total_pages: response.total_pages,
      }
    } catch (error) {
      console.error('[Movies Fetch Error]:', error)
      throw error
    }
  }

  return (
    <ErrorBoundary>
      <InfiniteScrollProvider
        queryKey={['movies', 'infinite', JSON.stringify(filters)]}
        fetchFn={fetchMovies}
        initialData={initialItems}
        initialTotalPages={initialTotalPages}
      >
        <InfiniteScrollWrapper
          emptyMessage={`No movies found${includeAdult ? ' with adult content' : ''}`}
        >
          {(items) => (
            <MediaGrid items={items as NormalizedMediaItem[]} />
          )}
        </InfiniteScrollWrapper>
      </InfiniteScrollProvider>
    </ErrorBoundary>
  )
}