/**
 * Search Endpoint Service
 * /search/multi, /search/movie, /search/tv, /search/person
 * 
 * Official Docs: https://developers.themoviedb.org/3/search
 * 
 * Flexible search across movies, TV shows, and people
 * Multi-search returns combined results with media_type discriminator
 */

import { tmdbClient } from '../client';
import { CACHE_CONFIG, VALIDATION_CONFIG } from '@/lib/config/app.config';
import type {
  SearchParams,
  SearchMovieResponse,
  SearchTVResponse,
  SearchPersonResponse,
  SearchMultiResponse,
  SearchMultiItem,
} from '@/types/search.types';
import type { TMDBMovie } from '@/types/movie.types';
import type { TMDBTV } from '@/types/tv.types';
import type { TMDBPerson } from '@/types/person.types';

// ============================================
// TYPE GUARDS (re-exported for convenience)
// ============================================

export function isSearchMovie(item: SearchMultiItem): item is SearchMultiItem & { media_type: 'movie' } {
  return item.media_type === 'movie';
}

export function isSearchTV(item: SearchMultiItem): item is SearchMultiItem & { media_type: 'tv' } {
  return item.media_type === 'tv';
}

export function isSearchPerson(item: SearchMultiItem): item is SearchMultiItem & { media_type: 'person' } {
  return item.media_type === 'person';
}

// ============================================
// MAIN SEARCH FUNCTIONS
// ============================================

/**
 * Multi-search across movies, TV, and people
 * 
 * @param params - Search parameters (query is required)
 * @param params.query - Search query string (min 2 chars)
 * @param params.page - Page number (default: 1)
 * @param params.language - Language code (default: 'en-US')
 * @param params.region - Region code (default: 'US')
 * @param params.adult - Include adult content (default: false)
 * @param options - Client options (limit, cache, retry, timeout)
 * 
 * @returns Array of search results with media_type discriminator
 * @returns null if query is too short or request fails
 * 
 * @example
 * ```ts
 * // Search for "star wars" across all media
 * const results = await searchMulti({ query: 'star wars' });
 * 
 * // Search with limit of 5 results
 * const results = await searchMulti({ query: 'batman' }, { limit: 5 });
 * 
 * // Filter to only movies from results
 * const movies = results?.filter(item => item.media_type === 'movie');
 * ```
 */
export async function searchMulti(
  params: SearchParams,
  options: {
    limit?: number;
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {}
): Promise<SearchMultiItem[] | null> {
  try {
    const { query, page = 1, language = 'en-US', region = 'US', adult = false } = params;
    const { limit, cache, retryAttempts, timeout } = options;

    // Validate query length
    if (!query || query.trim().length < VALIDATION_CONFIG.search.minQueryLength) {
      console.warn('[TMDB] Search query too short');
      return null;
    }

    const response = await tmdbClient.fetch<SearchMultiResponse>(
      '/search/multi',
      {
        query: query.trim(),
        page,
        language,
        region,
        adult,
      },
      {
        cache: cache ?? 'force-cache',
        next: {
          revalidate: CACHE_CONFIG.revalidation.trending,
        },
        retryAttempts,
        timeout,
      }
    );

    let results = response.results;

    if (limit && limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  } catch (error) {
    console.error(`[TMDB] Failed to search for "${params.query}":`, error);
    return null;
  }
}

/**
 * Search movies only
 * 
 * @param params - Search parameters (query is required)
 * @param params.query - Search query string (min 2 chars)
 * @param params.year - Filter by release year
 * @param params.primary_release_year - Filter by primary release year
 * @param options - Client options (limit, cache, retry, timeout)
 * 
 * @returns Array of movies or null if fails
 * 
 * @example
 * ```ts
 * // Search for "inception"
 * const movies = await searchMovies({ query: 'inception' });
 * 
 * // Search for "the dark knight" from 2008
 * const movies = await searchMovies({
 *   query: 'the dark knight',
 *   year: 2008
 * });
 * ```
 */
export async function searchMovies(
  params: SearchParams,
  options: {
    limit?: number;
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {}
): Promise<TMDBMovie[] | null> {
  try {
    const { query, page = 1, language = 'en-US', region = 'US', adult = false, year, primary_release_year } = params;
    const { limit, cache, retryAttempts, timeout } = options;

    if (!query || query.trim().length < VALIDATION_CONFIG.search.minQueryLength) {
      console.warn('[TMDB] Search query too short');
      return null;
    }

    const response = await tmdbClient.fetch<SearchMovieResponse>(
      '/search/movie',
      {
        query: query.trim(),
        page,
        language,
        region,
        adult,
        year,
        primary_release_year,
      },
      {
        cache: cache ?? 'force-cache',
        next: {
          revalidate: CACHE_CONFIG.revalidation.trending,
        },
        retryAttempts,
        timeout,
      }
    );

    let results = response.results;

    if (limit && limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  } catch (error) {
    console.error(`[TMDB] Failed to search movies for "${params.query}":`, error);
    return null;
  }
}

/**
 * Search TV shows only
 * 
 * @param params - Search parameters (query is required)
 * @param params.query - Search query string (min 2 chars)
 * @param params.first_air_date_year - Filter by first air date year
 * @param options - Client options (limit, cache, retry, timeout)
 * 
 * @returns Array of TV shows or null if fails
 * 
 * @example
 * ```ts
 * // Search for "breaking bad"
 * const shows = await searchTV({ query: 'breaking bad' });
 * 
 * // Search for "game of thrones" from 2011
 * const shows = await searchTV({
 *   query: 'game of thrones',
 *   first_air_date_year: 2011
 * });
 * ```
 */
export async function searchTV(
  params: SearchParams,
  options: {
    limit?: number;
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {}
): Promise<TMDBTV[] | null> {
  try {
    const { query, page = 1, language = 'en-US', region = 'US', adult = false, first_air_date_year } = params;
    const { limit, cache, retryAttempts, timeout } = options;

    if (!query || query.trim().length < VALIDATION_CONFIG.search.minQueryLength) {
      console.warn('[TMDB] Search query too short');
      return null;
    }

    const response = await tmdbClient.fetch<SearchTVResponse>(
      '/search/tv',
      {
        query: query.trim(),
        page,
        language,
        region,
        adult,
        first_air_date_year,
      },
      {
        cache: cache ?? 'force-cache',
        next: {
          revalidate: CACHE_CONFIG.revalidation.trending,
        },
        retryAttempts,
        timeout,
      }
    );

    let results = response.results;

    if (limit && limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  } catch (error) {
    console.error(`[TMDB] Failed to search TV for "${params.query}":`, error);
    return null;
  }
}

/**
 * Search people only
 * 
 * @param params - Search parameters (query is required)
 * @param params.query - Search query string (min 2 chars)
 * @param options - Client options (limit, cache, retry, timeout)
 * 
 * @returns Array of people or null if fails
 * 
 * @example
 * ```ts
 * // Search for "leonardo dicaprio"
 * const people = await searchPeople({ query: 'leonardo dicaprio' });
 * ```
 */
export async function searchPeople(
  params: SearchParams,
  options: {
    limit?: number;
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {}
): Promise<TMDBPerson[] | null> {
  try {
    const { query, page = 1, language = 'en-US', region = 'US', adult = false } = params;
    const { limit, cache, retryAttempts, timeout } = options;

    if (!query || query.trim().length < VALIDATION_CONFIG.search.minQueryLength) {
      console.warn('[TMDB] Search query too short');
      return null;
    }

    const response = await tmdbClient.fetch<SearchPersonResponse>(
      '/search/person',
      {
        query: query.trim(),
        page,
        language,
        region,
        adult,
      },
      {
        cache: cache ?? 'force-cache',
        next: {
          revalidate: CACHE_CONFIG.revalidation.trending,
        },
        retryAttempts,
        timeout,
      }
    );

    let results = response.results;

    if (limit && limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  } catch (error) {
    console.error(`[TMDB] Failed to search people for "${params.query}":`, error);
    return null;
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Search with auto-detection and best guess
 * Prioritizes movies, then TV, then people
 */
export async function searchAll(
  query: string,
  limit: number = 10,
  adult: boolean = false
): Promise<{
  movies: TMDBMovie[] | null;
  tv: TMDBTV[] | null;
  people: TMDBPerson[] | null;
}> {
  const [movies, tv, people] = await Promise.all([
    searchMovies({ query, adult }, { limit }),
    searchTV({ query, adult }, { limit }),
    searchPeople({ query, adult }, { limit }),
  ]);

  return { movies, tv, people };
}

/**
 * Quick search that returns only movies and TV (for home page search)
 */
export async function searchMedia(
  query: string,
  limit: number = 20,
  adult: boolean = false
): Promise<SearchMultiItem[] | null> {
  return searchMulti({ query, adult }, { limit });
}