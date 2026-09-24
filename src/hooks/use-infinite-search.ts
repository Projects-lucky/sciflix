/**
 * useInfiniteSearch Hook
 * Search-specific TanStack Query infinite query
 *
 * Encapsulates:
 * - Endpoint routing by type (multi, movie, tv, person)
 * - Fetch call to /api/tmdb proxy
 * - Response normalization (results + page metadata)
 *
 * The component that consumes this hook only renders.
 * No fetch logic leaks into UI.
 */

'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfinitePage } from '@/components/shared/infinite-scroll';
import type { TMDBMovie } from '@/types/movie.types';
import type { TMDBTV } from '@/types/tv.types';
import type { TMDBPerson } from '@/types/person.types';

// ============================================
// TYPES
// ============================================

export type SearchType = 'multi' | 'movie' | 'tv' | 'person';

export type SearchResultItem = (TMDBMovie | TMDBTV | TMDBPerson) & {
  media_type?: 'movie' | 'tv' | 'person';
};

// ============================================
// FETCH FUNCTION
// ============================================

/**
 * Fetch one page of search results through the secure proxy
 * Proxy injects the Bearer token — no token visible to client
 */
async function fetchSearchPage(
  query: string,
  type: SearchType,
  language: string,
  adult: boolean,
  page: number
): Promise<InfinitePage<SearchResultItem>> {
  const params = new URLSearchParams({
    query,
    page: String(page),
    language,
    include_adult: String(adult),
  });

  const url = `/api/tmdb/search/${type}?${params.toString()}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    page: number;
    results: SearchResultItem[];
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
// HOOK
// ============================================

export interface UseInfiniteSearchParams {
  query: string;
  type: SearchType;
  language: string;
  adult: boolean;
  enabled?: boolean;
}

export function useInfiniteSearch({
  query,
  type,
  language,
  adult,
  enabled = true,
}: UseInfiniteSearchParams) {
  return useInfiniteQuery({
    queryKey: ['search', query, type, language, adult],

    queryFn: ({ pageParam }) =>
      fetchSearchPage(query, type, language, adult, pageParam as number),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) return undefined;
      return lastPage.page + 1;
    },

    // Only fetch when query is valid
    enabled: enabled && query.trim().length >= 2,

    // Keep previous data visible while loading new query
    placeholderData: (previous) => previous,
  });
}