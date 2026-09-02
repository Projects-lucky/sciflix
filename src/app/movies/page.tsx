/**
 * Movies Page
 * 
 * Server component that renders the movie discovery page with filtering and infinite scrolling.
 * Pre-fetches initial movie data and genre options for SEO and performance.
 * Uses sidebar for filter controls with Shadcn UI components.
 * 
 * Revalidates every 3600 seconds (1 hour) for updated content.
 */

import { moviesService } from '@/services/tmdb/movies.service'
import { genresService } from '@/services/tmdb/genres.service'
import { FilterContainer } from '@/components'
import { MoviesClient } from './MoviesClient'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  SORT_OPTIONS_MOVIE,
  RATING_OPTIONS,
  YEAR_OPTIONS,
  LANGUAGE_OPTIONS,
  COUNTRY_OPTIONS,
  RUNTIME_OPTIONS,
  INCLUDE_ADULT_OPTIONS,
  DEFAULT_FILTERS,
} from '@/constants/filters'
import { ListFilterPlus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const revalidate = 3600

interface MoviesPageProps {
  searchParams: Promise<{
    genre?: string
    year?: string
    rating?: string
    sort?: string
    language?: string
    country?: string
    runtime?: string
    includeAdult?: string
  }>
}

/**
 * Movies Page Component
 * 
 * @param searchParams - URL query parameters for filtering
 * @returns Rendered movies page with filters and content
 */
export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams
  
  // Parse and validate filter values from URL parameters
  const genre = params.genre || ''
  const year = parseInt(params.year || '0') || undefined
  const rating = parseFloat(params.rating || '0') || undefined
  const sort = params.sort || DEFAULT_FILTERS.MOVIE.sort
  const language = params.language || ''
  const country = params.country || ''
  const runtime = parseInt(params.runtime || '0') || undefined
  const includeAdult = params.includeAdult === 'true'

  // Fetch genre options for filter dropdown
  const genres = await genresService.getMovieGenres()
  const genreOptions = genres.map((g) => ({
    value: String(g.id),
    label: g.name,
  }))

  // Build filter object for TMDB API request
  const filters: any = {
    sort_by: sort,
    ...(genre && { with_genres: genre }),
    ...(year && { primary_release_year: year }),
    ...(rating && { 'vote_average.gte': rating }),
    ...(language && { with_original_language: language }),
    ...(country && { with_origin_country: country }),
    ...(runtime && { 'with_runtime.gte': runtime }),
    include_adult: includeAdult,
  }

  // Fetch first page of movie data
  const initialData = await moviesService.getDiscover({ ...filters, page: 1 })

  // Transform API response to match component expectations
  const initialItems = initialData.results.map((item) => ({
    id: item.id,
    title: item.title,
    mediaType: 'movie' as const,
    image: item.poster_path,
    rating: item.vote_average,
    year: item.release_date?.split('-')[0] || 'N/A',
  }))

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        
        <FilterContainer
          type="movie"
          genreOptions={genreOptions}
          yearOptions={YEAR_OPTIONS}
          ratingOptions={RATING_OPTIONS}
          sortOptions={SORT_OPTIONS_MOVIE}
          languageOptions={LANGUAGE_OPTIONS}
          countryOptions={COUNTRY_OPTIONS}
          runtimeOptions={RUNTIME_OPTIONS}
          includeAdultOptions={INCLUDE_ADULT_OPTIONS}
          basePath="/movies"
        />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <SidebarTrigger className="h-10 w-10 border rounded-md border-red-primary bg-red-primary/10">
              <ListFilterPlus size={22} className="text-red-primary" />
            </SidebarTrigger>
            <h1 className="text-3xl font-bold font-sans text-red-primary">Movies</h1>
          </div>

          <div className="mt-6">
            <MoviesClient
              initialItems={initialItems}
              initialTotalPages={initialData.total_pages}
              filters={filters}
              includeAdult={includeAdult}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}