/**
 * Search Client Component
 * 
 * Client-side component that handles infinite scrolling for search results.
 * Falls back to trending content when no search query is provided.
 * Includes empty state with suggested search terms.
 */

'use client'

import { useCallback } from 'react'
import { searchService, ExtraSearchOptions } from '@/services/tmdb/search.service'
import { trendingService } from '@/services/tmdb/trending.service'
import { InfiniteScrollProvider } from '@/providers/InfiniteScrollProvider'
import { InfiniteScrollWrapper } from '@/components/shared/InfiniteScrollWrapper'
import { MediaGrid } from '@/components/shared/MediaGrid'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { transformSearchResults } from '@/transformers/search.transformer'

interface SearchClientProps {
  query: string
  type: string
  includeAdult: boolean
  language: string
  targetYear: string
  initialItems: any[]
  initialTotalPages: number
}

/**
 * SearchClient Component
 * 
 * @param query - Search query string
 * @param type - Media type filter (multi, movie, tv, person)
 * @param includeAdult - Whether to include adult content
 * @param language - Language filter
 * @param targetYear - Year filter for movies/TV
 * @param initialItems - Pre-fetched search results for first page
 * @param initialTotalPages - Total number of pages available
 */
export function SearchClient({
  query,
  type,
  includeAdult,
  language,
  targetYear,
  initialItems = [], 
  initialTotalPages = 0, 
}: SearchClientProps) {
  
  /**
   * Fetches search results or trending content for a specific page
   * 
   * @param page - Page number to fetch
   * @returns Formatted search results with pagination info
   */
  const fetchSearch = useCallback(async (page: number) => {
    let response: any
    
    // Fallback to trending if no search query
    if (!query) {
      response = await trendingService.getTrending('all', 'day', page)
      const results = response.results || []
      return {
        results: transformSearchResults(results),
        total_pages: response.total_pages || 0,
      }
    }

    // Build search options
    const additionalOptions: ExtraSearchOptions = {
      include_adult: includeAdult,
      ...(language && { language }),
    }
    
    // Route to appropriate search endpoint
    if (type === 'multi') {
      response = await searchService.searchMulti(query, page, includeAdult, additionalOptions)
    } else if (type === 'movie') {
      if (targetYear) additionalOptions.primary_release_year = targetYear
      response = await searchService.searchMovies(query, page, additionalOptions)
    } else if (type === 'tv') {
      if (targetYear) additionalOptions.first_air_date_year = targetYear
      response = await searchService.searchTV(query, page, additionalOptions)
    } else if (type === 'person') {
      response = await searchService.searchPerson(query, page, additionalOptions)
    } else {
      response = await searchService.searchMulti(query, page, includeAdult, additionalOptions)
    }

    const results = response.results || []
    
    return {
      results: transformSearchResults(results),
      total_pages: response.total_pages || 0,
    }
  }, [query, type, includeAdult, language, targetYear])

  const hasItems = initialItems && initialItems.length > 0

  // Empty state with suggested search terms
  if (!hasItems && initialTotalPages === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          {query ? `No results found for "${query}"` : "No trending items found."}
        </p>
        <p className="text-sm text-muted-foreground/60 mt-2">
          {query ? 'Try adjusting your search terms or filters.' : 'Check back later for trending content.'}
        </p>
        {query && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {['Inception', 'The Dark Knight', 'Breaking Bad', 'Leonardo DiCaprio'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search)
                  params.set('q', term)
                  window.location.href = `/search?${params.toString()}`
                }}
                className="px-3 py-1 text-xs bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Normalize initial data format
  const normalizedInitialData = (initialItems || []).map((item: any) => ({
    ...item,
    mediaType: item.mediaType || 'movie',
  }))

  return (
    <ErrorBoundary>
      <InfiniteScrollProvider
        queryKey={['search-infinite', query, type, language, targetYear, String(includeAdult)]}
        fetchFn={fetchSearch}
        initialData={normalizedInitialData}
        initialTotalPages={initialTotalPages || 0}
      >
        <InfiniteScrollWrapper 
          emptyMessage={query ? `No results found for "${query}"` : "No more trending items."}
        >
          {(pages) => {
            const allItems = pages.flatMap((page: any) => page.results || page)
            return <MediaGrid items={allItems} />
          }}
        </InfiniteScrollWrapper>
      </InfiniteScrollProvider>
    </ErrorBoundary>
  )
}