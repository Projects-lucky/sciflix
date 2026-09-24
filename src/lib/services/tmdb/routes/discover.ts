/**
 * Discover Endpoint Service
 * /discover/movie, /discover/tv
 * 
 * Official Docs: https://developers.themoviedb.org/3/discover/movie-discover
 * 
 * Flexible discover endpoint with all TMDB parameters supported
 * Genre filtering, sorting, pagination, and advanced filters
 */

import { tmdbClient } from '../client';
import { CACHE_CONFIG, HOME_CONFIG } from '@/lib/config/app.config';
import type {
  DiscoverMovieParams,
  DiscoverTVParams,
  DiscoverMovieResponse,
  DiscoverTVResponse,
} from '@/types/discover.types';
import type { TMDBMovie } from '@/types/movie.types';
import type { TMDBTV } from '@/types/tv.types';

// ============================================
// MAIN FETCH FUNCTIONS
// ============================================

/**
 * Discover movies with flexible filtering
 * 
 * @param params - Discover parameters (all optional)
 * @param params.with_genres - Comma-separated genre IDs (e.g., '28,35')
 * @param params.sort_by - Sort order (default: 'popularity.desc')
 * @param params.page - Page number (default: 1)
 * @param params.adult - Include adult content (default: false)
 * @param params.year - Filter by release year
 * @param params.primary_release_year - Filter by primary release year
 * @param params.with_cast - Filter by cast (comma-separated person IDs)
 * @param params.with_crew - Filter by crew (comma-separated person IDs)
 * @param params.with_people - Filter by people (comma-separated person IDs)
 * @param params.with_companies - Filter by production companies
 * @param params.with_keywords - Filter by keywords
 * @param params.without_keywords - Exclude keywords
 * @param params.with_runtime - Filter by runtime range (e.g., '100.200')
 * @param params.region - Region code
 * @param params.language - Language code (default: 'en-US')
 * @param params['vote_average.gte'] - Minimum vote average
 * @param params['vote_average.lte'] - Maximum vote average
 * @param params['vote_count.gte'] - Minimum vote count
 * @param params['vote_count.lte'] - Maximum vote count
 * @param options - Client options (limit, cache, retry, timeout)
 * 
 * @returns Movie results or null if fails
 * 
 * @example
 * ```ts
 * // Get action movies
 * const movies = await discoverMovies({
 *   with_genres: '28'
 * });
 * 
 * // Get top 10 action movies from 2023 with high ratings
 * const movies = await discoverMovies({
 *   with_genres: '28',
 *   year: 2023,
 *   sort_by: 'vote_average.desc',
 *   'vote_count.gte': 100
 * }, { limit: 10 });
 * 
 * // Get movies with specific cast
 * const movies = await discoverMovies({
 *   with_cast: '287,1245' // Brad Pitt, Tom Cruise
 * });
 * ```
 */
export async function discoverMovies(
  params: DiscoverMovieParams = {},
  options: {
    limit?: number;
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {}
): Promise<TMDBMovie[] | null> {
  try {
    const { limit, cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<DiscoverMovieResponse>(
      '/discover/movie',
      {
        sort_by: params.sort_by ?? HOME_CONFIG.genreSections.sortBy,
        page: params.page ?? 1,
        language: params.language ?? 'en-US',
        adult: params.adult ?? HOME_CONFIG.genreSections.adult,
        ...params,
      },
      {
        cache: cache ?? 'force-cache',
        next: {
          revalidate: CACHE_CONFIG.revalidation.discover,
          tags: [`discover-${params.with_genres || 'all'}`],
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
    console.error('[TMDB] Failed to discover movies:', error);
    return null;
  }
}

/**
 * Discover TV shows with flexible filtering
 * 
 * @param params - Discover parameters (all optional)
 * @param params.with_genres - Comma-separated genre IDs
 * @param params.sort_by - Sort order (default: 'popularity.desc')
 * @param params.page - Page number (default: 1)
 * @param params.adult - Include adult content (default: false)
 * @param params.first_air_date_year - Filter by first air date year
 * @param params.with_networks - Filter by network IDs
 * @param params.with_companies - Filter by production companies
 * @param params.with_keywords - Filter by keywords
 * @param params.without_keywords - Exclude keywords
 * @param params.region - Region code
 * @param params.language - Language code (default: 'en-US')
 * @param params['vote_average.gte'] - Minimum vote average
 * @param params['vote_average.lte'] - Maximum vote average
 * @param params['vote_count.gte'] - Minimum vote count
 * @param params['vote_count.lte'] - Maximum vote count
 * @param options - Client options (limit, cache, retry, timeout)
 * 
 * @returns TV results or null if fails
 * 
 * @example
 * ```ts
 * // Get comedy TV shows
 * const shows = await discoverTV({
 *   with_genres: '35'
 * });
 * 
 * // Get top 5 drama shows from 2022 with high ratings
 * const shows = await discoverTV({
 *   with_genres: '18',
 *   first_air_date_year: 2022,
 *   'vote_average.gte': 8.0
 * }, { limit: 5 });
 * ```
 */
export async function discoverTV(
  params: DiscoverTVParams = {},
  options: {
    limit?: number;
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {}
): Promise<TMDBTV[] | null> {
  try {
    const { limit, cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<DiscoverTVResponse>(
      '/discover/tv',
      {
        sort_by: params.sort_by ?? HOME_CONFIG.genreSections.sortBy,
        page: params.page ?? 1,
        language: params.language ?? 'en-US',
        adult: params.adult ?? HOME_CONFIG.genreSections.adult,
        ...params,
      },
      {
        cache: cache ?? 'force-cache',
        next: {
          revalidate: CACHE_CONFIG.revalidation.discover,
          tags: [`discover-tv-${params.with_genres || 'all'}`],
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
    console.error('[TMDB] Failed to discover TV shows:', error);
    return null;
  }
}

// ============================================
// CONVENIENCE FUNCTIONS FOR SPECIFIC FILTERS
// ============================================

/**
 * Get movies by genre
 * @param genreId - Single genre ID
 * @param limit - Number of movies to return
 * @param adult - Include adult content
 */
export async function getMoviesByGenre(
  genreId: number,
  limit: number = HOME_CONFIG.genreSections.itemCount,
  adult: boolean = HOME_CONFIG.genreSections.adult
): Promise<TMDBMovie[] | null> {
  return discoverMovies(
    {
      with_genres: String(genreId),
      adult,
    },
    { limit }
  );
}

/**
 * Get movies by multiple genres (AND filter)
 * @param genreIds - Array of genre IDs
 * @param limit - Number of movies to return
 */
export async function getMoviesByGenres(
  genreIds: number[],
  limit: number = HOME_CONFIG.genreSections.itemCount
): Promise<TMDBMovie[] | null> {
  return discoverMovies(
    {
      with_genres: genreIds.join(','),
    },
    { limit }
  );
}

/**
 * Get TV shows by genre
 */
export async function getTVByGenre(
  genreId: number,
  limit: number = HOME_CONFIG.genreSections.itemCount,
  adult: boolean = HOME_CONFIG.genreSections.adult
): Promise<TMDBTV[] | null> {
  return discoverTV(
    {
      with_genres: String(genreId),
      adult,
    },
    { limit }
  );
}

/**
 * Get latest movies (sorted by release date)
 */
export async function getLatestMovies(
  limit: number = 10
): Promise<TMDBMovie[] | null> {
  return discoverMovies(
    {
      sort_by: 'release_date.desc',
    },
    { limit }
  );
}

/**
 * Get top rated movies (minimum 100 votes for quality)
 */
export async function getTopRatedMovies(
  limit: number = 10
): Promise<TMDBMovie[] | null> {
  return discoverMovies(
    {
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100,
    },
    { limit }
  );
}

// ============================================
// HOME PAGE SPECIFIC (Aggregated)
// ============================================

/**
 * Get movies for multiple genres for home page
 * @param genreIds - Array of genre IDs
 * @param limit - Items per genre (default: from config)
 * @returns Array of genre sections with movies
 */
export async function getGenreSections(
  genreIds: number[],
  limit: number = HOME_CONFIG.genreSections.itemCount
): Promise<Array<{ genreId: number; movies: TMDBMovie[] }>> {
  try {
    const results = await Promise.allSettled(
      genreIds.map((genreId) =>
        discoverMovies(
          {
            with_genres: String(genreId),
          },
          { limit }
        )
      )
    );

    return results.map((result, index) => ({
      genreId: genreIds[index],
      movies: result.status === 'fulfilled' && result.value ? result.value : [],
    }));
  } catch (error) {
    console.error('[TMDB] Failed to fetch genre sections:', error);
    return genreIds.map((genreId) => ({ genreId, movies: [] }));
  }
}