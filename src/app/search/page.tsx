/**
 * Search Page
 * 
 * Server component that handles search functionality across movies, TV shows, and people.
 * Displays trending content when no search query is provided.
 * Supports multi-type search with filters for language, adult content, and year.
 * Uses dynamic rendering with no caching for real-time results.
 */

import { searchService, ExtraSearchOptions } from '@/services/tmdb/search.service'
import { trendingService } from '@/services/tmdb/trending.service'
import { SearchFilterContainer } from '@/components/filters/search'
import { SearchClient } from './SearchClient'
import { SEARCH_TYPE_OPTIONS, DEFAULT_SEARCH_FILTERS } from '@/constants/search'
import { LANGUAGE_OPTIONS, INCLUDE_ADULT_OPTIONS, YEAR_OPTIONS } from '@/constants/filters'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    type?: string
    language?: string
    includeAdult?: string
    page?: string
    year?: string
  }>
}

/**
 * Search Page Component
 * 
 * @param searchParams - URL query parameters for search and filters
 * @returns Rendered search page with results or trending content
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const type = params.type || DEFAULT_SEARCH_FILTERS.type
  const language = params.language || ''
  const includeAdult = params.includeAdult === 'true'
  const page = parseInt(params.page || '1', 10)
  const targetYear = params.year || ''

  let results: any = { results: [], total_results: 0, total_pages: 0, page: 1 }
  let initialItems: any[] = []
  let initialTotalPages = 0

  try {
    // Show trending if no search query
    if (!query) {
      results = await trendingService.getTrending('all', 'day', page)
    } else {
      const additionalOptions: ExtraSearchOptions = {
        include_adult: includeAdult,
        ...(language && { language }),
      }

      // Route to appropriate search endpoint based on type
      if (type === 'multi') {
        results = await searchService.searchMulti(query, page, includeAdult, additionalOptions)
      } else if (type === 'movie') {
        if (targetYear) additionalOptions.primary_release_year = targetYear
        results = await searchService.searchMovies(query, page, additionalOptions)
      } else if (type === 'tv') {
        if (targetYear) additionalOptions.first_air_date_year = targetYear
        results = await searchService.searchTV(query, page, additionalOptions)
      } else if (type === 'person') {
        results = await searchService.searchPerson(query, page, additionalOptions)
      }
    }
  } catch (error) {
    console.error('[Search/Trending Pipeline Crash]:', error)
  }

  // Normalize results
  const cleanResultsArray = Array.isArray(results?.results) ? results.results : []
  initialTotalPages = results?.total_pages || 0

  // Transform results to consistent format
  initialItems = cleanResultsArray.map((item: any) => {
    const isPerson = item.media_type === 'person'

    return {
      id: item.id,
      title: item.title || item.name || 'Untitled',
      image: isPerson ? item.profile_path : (item.poster_path || item.backdrop_path),
      rating: item.vote_average || 0,
      year: isPerson
        ? 'N/A'
        : (item.release_date ? String(item.release_date).split('-')[0] :
           item.first_air_date ? String(item.first_air_date).split('-')[0] : 'N/A'),
      mediaType: item.media_type || 'movie',
      name: item.name,
      profile: item.profile_path,
      department: item.known_for_department,
    }
  })

  const hasResults = cleanResultsArray.length > 0

  return (
    <section className="search-page container mx-auto px-4 py-8">
      <h1 className="text-3xl font-light mb-8 flex items-center justify-center font-sans first-letter:text-red-primary">
        {query ? `Search Results for "${query}"` : 'Trending Now'}
      </h1>

      <SearchFilterContainer
        typeOptions={SEARCH_TYPE_OPTIONS}
        yearOptions={YEAR_OPTIONS}
        languageOptions={LANGUAGE_OPTIONS}
        includeAdultOptions={INCLUDE_ADULT_OPTIONS}
      />

      <div className="mt-6">
        <p className="text-sm text-red-primary mb-4 ml-1.5">
          {hasResults
            ? `Found ${results.total_results || 0} results`
            : `No results found`
          }
          {includeAdult && <span className="ml-2 text-destructive font-medium">(Adult content included)</span>}
          {!query && <span className="ml-2">• Showing Trending</span>}
          {query && type !== 'multi' && (
            <span className="ml-2">
              • Type: {SEARCH_TYPE_OPTIONS.find(t => String(t.value) === type)?.label}
            </span>
          )}
        </p>

        <SearchClient
          query={query}
          type={type}
          includeAdult={includeAdult}
          language={language}
          targetYear={targetYear}
          initialItems={initialItems}
          initialTotalPages={initialTotalPages}
        />
      </div>
    </section>
  )
}