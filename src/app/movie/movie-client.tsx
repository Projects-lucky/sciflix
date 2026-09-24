/**
 * Movie Client Component
 * Owns the movie browse UX:
 * - FilterBar (primary filters + More Filters dialog)
 * - Infinite scroll grid of MovieCard
 */

'use client';

import { FilterBar } from '@/components/filters/filter-bar';
import {
  InfiniteScroll,
  type InfinitePage,
} from '@/components/shared/infinite-scroll';
import { MovieCard } from '@/components/movie/movie-card';
import { SearchEmpty } from '@/components/search/search-empty';
import type { TMDBMovie } from '@/types/movie.types';

// ============================================
// TYPES
// ============================================

export interface MovieClientParams {
  withGenres?: string;
  sortBy?: string;
  minVoteCount?: number;
  runtime?: string;
  page?: number;
  language?: string;
  adult?: boolean;
  withOriginCountry?: string;
  withOriginalLanguage?: string;
  releaseDateGte?: string;
  releaseDateLte?: string;
  year?: number;
  voteAverageGte?: number;
  voteAverageLte?: number;
  certification?: string;
}

export interface MovieClientProps {
  params: MovieClientParams;
}

// ============================================
// FETCH FUNCTION
// ============================================

async function fetchDiscoverMovies(
  params: MovieClientParams,
  page: number
): Promise<InfinitePage<TMDBMovie>> {
  const query = new URLSearchParams();

  // Core filters
  if (params.withGenres) query.set('with_genres', params.withGenres);
  if (params.sortBy) query.set('sort_by', params.sortBy);
  if (params.minVoteCount && params.minVoteCount > 0) {
    query.set('vote_count.gte', String(params.minVoteCount));
  }
  if (params.runtime) query.set('with_runtime', params.runtime);

  // Common
  if (params.language) query.set('language', params.language);
  if (typeof params.adult === 'boolean') {
    query.set('include_adult', String(params.adult));
  }

  // New: Country + Original Language
  if (params.withOriginCountry) {
    query.set('with_origin_country', params.withOriginCountry);
  }
  if (params.withOriginalLanguage) {
    query.set('with_original_language', params.withOriginalLanguage);
  }

  // New: Release date range (dot notation)
  if (params.releaseDateGte) {
    query.set('release_date.gte', params.releaseDateGte);
  }
  if (params.releaseDateLte) {
    query.set('release_date.lte', params.releaseDateLte);
  }

  // Legacy: single year
  if (params.year) query.set('primary_release_year', String(params.year));

  // New: Vote average range (dot notation)
  if (typeof params.voteAverageGte === 'number') {
    query.set('vote_average.gte', String(params.voteAverageGte));
  }
  if (typeof params.voteAverageLte === 'number') {
    query.set('vote_average.lte', String(params.voteAverageLte));
  }

  // New: Certification (requires country)
  if (params.certification) {
    query.set('certification', params.certification);
    query.set('certification_country', 'US');
  }

  // Pagination
  query.set('page', String(page));

  const response = await fetch(
    `/api/tmdb/discover/movie?${query.toString()}`,
    { headers: { Accept: 'application/json' } }
  );

  if (!response.ok) {
    throw new Error(`Discover failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    page: number;
    results: TMDBMovie[];
    total_pages: number;
    total_results: number;
  };

  return {
    results: data.results ?? [],
    page: data.page ?? page,
    total_pages: data.total_pages ?? 1,
    total_results: data.total_results ?? 0,
  };
}

// ============================================
// COMPONENT
// ============================================

export function MovieClient({ params }: MovieClientProps) {
  return (
    <>
      {/* Filter bar — primary filters + More Filters dialog */}
      <FilterBar type="movie" />

      {/* Infinite Grid */}
      <div className="mt-6">
        <InfiniteScroll<TMDBMovie>
          queryKey={['discover-movie', params]}
          fetchFn={(page) => fetchDiscoverMovies(params, page)}
          getItemKey={(movie) => `movie-${movie.id}`}
          renderItem={(movie) => (
            <MovieCard item={movie} className='min-w-0 min-h-0 items-stretch justify-items-stretch' />
          )}
          emptyState={
            <SearchEmpty variant="no-results" query="these filters" />
          }
          className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] justify-items-stretch items-stretch gap-x-4 auto-rows-85 sm:auto-rows-90 md:auto-rows-105 gap-y-8 md:gap-9 w-full"
        />
      </div>
    </>
  );
}
