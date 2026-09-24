/**
 * TV Client Component
 * Owns the TV browse UX:
 * - FilterBar (primary filters + More Filters dialog)
 * - Infinite scroll grid of MovieCard (with mediaType="tv")
 */

'use client';

import { FilterBar } from '@/components/filters/filter-bar';
import {
  InfiniteScroll,
  type InfinitePage,
} from '@/components/shared/infinite-scroll';
import { MovieCard } from '@/components/movie/movie-card';
import { SearchEmpty } from '@/components/search/search-empty';
import type { TMDBTV } from '@/types/tv.types';

// ============================================
// TYPES
// ============================================

export interface TVClientParams {
  withGenres?: string;
  sortBy?: string;
  minVoteCount?: number;
  page?: number;
  language?: string;
  adult?: boolean;
  withOriginCountry?: string;
  withOriginalLanguage?: string;
  firstAirDateGte?: string;
  firstAirDateLte?: string;
  firstAirDateYear?: number;
  voteAverageGte?: number;
  voteAverageLte?: number;
  withNetworks?: number;
}

export interface TVClientProps {
  params: TVClientParams;
}

// ============================================
// FETCH FUNCTION
// ============================================

async function fetchDiscoverTV(
  params: TVClientParams,
  page: number
): Promise<InfinitePage<TMDBTV>> {
  const query = new URLSearchParams();

  // Core filters
  if (params.withGenres) query.set('with_genres', params.withGenres);
  if (params.sortBy) query.set('sort_by', params.sortBy);
  if (params.minVoteCount && params.minVoteCount > 0) {
    query.set('vote_count.gte', String(params.minVoteCount));
  }

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

  // New: First air date range (dot notation)
  if (params.firstAirDateGte) {
    query.set('first_air_date.gte', params.firstAirDateGte);
  }
  if (params.firstAirDateLte) {
    query.set('first_air_date.lte', params.firstAirDateLte);
  }

  // Legacy: single year
  if (params.firstAirDateYear) {
    query.set('first_air_date_year', String(params.firstAirDateYear));
  }

  // New: Vote average range (dot notation)
  if (typeof params.voteAverageGte === 'number') {
    query.set('vote_average.gte', String(params.voteAverageGte));
  }
  if (typeof params.voteAverageLte === 'number') {
    query.set('vote_average.lte', String(params.voteAverageLte));
  }

  // New: Networks (TV only)
  if (typeof params.withNetworks === 'number') {
    query.set('with_networks', String(params.withNetworks));
  }

  // Pagination
  query.set('page', String(page));

  const response = await fetch(
    `/api/tmdb/discover/tv?${query.toString()}`,
    { headers: { Accept: 'application/json' } }
  );

  if (!response.ok) {
    throw new Error(`Discover failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    page: number;
    results: TMDBTV[];
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

export function TVClient({ params }: TVClientProps) {
  return (
    <>
      {/* Filter bar — primary filters + More Filters dialog */}
      <FilterBar type="tv" />

      {/* Infinite Grid */}
      <div className="mt-6">
        <InfiniteScroll<TMDBTV>
          queryKey={['discover-tv', params]}
          fetchFn={(page) => fetchDiscoverTV(params, page)}
          getItemKey={(show) => `tv-${show.id}`}
          renderItem={(show) => (
            <MovieCard item={show} className='min-w-0 min-h-0 items-stretch justify-items-stretch' />
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