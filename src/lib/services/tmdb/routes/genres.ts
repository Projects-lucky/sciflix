/**
 * Genre Endpoint Service
 * /genre/movie/list, /genre/tv/list
 *
 * Official Docs: https://developers.themoviedb.org/3/genres/get-movie-list
 *
 * Dynamic genre fetching - no hardcoded IDs
 * Movie and TV have DIFFERENT genre lists — separate fallbacks for each.
 */

import { tmdbClient } from '../client';
import { CACHE_CONFIG } from '@/lib/config/app.config';
import type { GenreListResponse, GenreParams } from '@/types/genre.types';
import type { TMDBGenre } from '@/types/tmdb.types';

// ============================================
// FALLBACK GENRES — MOVIES
// Used only when /genre/movie/list fails
// ============================================

export const FALLBACK_MOVIE_GENRES: TMDBGenre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

// ============================================
// FALLBACK GENRES — TV
// Used only when /genre/tv/list fails
// NOTE: TV has different IDs than movies (e.g., 10759 vs 28)
// ============================================

export const FALLBACK_TV_GENRES: TMDBGenre[] = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
];

// ============================================
// COMBINED FALLBACK (for lookup helpers)
// Merges both lists, movies win on duplicate IDs (safe — same name)
// ============================================

const FALLBACK_ALL_GENRES: TMDBGenre[] = [
  ...FALLBACK_MOVIE_GENRES,
  // Add TV-only genres (skip duplicates by ID)
  ...FALLBACK_TV_GENRES.filter(
    (tvGenre) => !FALLBACK_MOVIE_GENRES.some((m) => m.id === tvGenre.id)
  ),
];

// Legacy export — kept for backward compatibility
export const FALLBACK_GENRES: TMDBGenre[] = FALLBACK_MOVIE_GENRES;

// ============================================
// MAIN FETCH FUNCTIONS
// ============================================

/**
 * Fetch movie genres from TMDB
 */
export async function getMovieGenres(
  params: GenreParams & { count?: number } = {},
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {}
): Promise<TMDBGenre[]> {
  try {
    const { language = 'en-US', count } = params;
    const { cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<GenreListResponse>(
      '/genre/movie/list',
      { language },
      {
        cache: cache ?? 'force-cache',
        next: {
          revalidate: CACHE_CONFIG.revalidation.genres,
          tags: [CACHE_CONFIG.tags.genres],
        },
        retryAttempts,
        timeout,
      }
    );

    let genres = response.genres;

    if (count && count > 0) {
      genres = genres.slice(0, count);
    }

    return genres;
  } catch (error) {
    console.error('[TMDB] Failed to fetch movie genres, using fallback:', error);

    let fallback = FALLBACK_MOVIE_GENRES;

    if (params.count && params.count > 0) {
      fallback = fallback.slice(0, params.count);
    }

    return fallback;
  }
}

/**
 * Fetch TV genres from TMDB
 */
export async function getTVGenres(
  params: GenreParams & { count?: number } = {},
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {}
): Promise<TMDBGenre[]> {
  try {
    const { language = 'en-US', count } = params;
    const { cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<GenreListResponse>(
      '/genre/tv/list',
      { language },
      {
        cache: cache ?? 'force-cache',
        next: {
          revalidate: CACHE_CONFIG.revalidation.genres,
          tags: [`${CACHE_CONFIG.tags.genres}-tv`],
        },
        retryAttempts,
        timeout,
      }
    );

    let genres = response.genres;

    if (count && count > 0) {
      genres = genres.slice(0, count);
    }

    return genres;
  } catch (error) {
    console.error('[TMDB] Failed to fetch TV genres, using fallback:', error);

    let fallback = FALLBACK_TV_GENRES;

    if (params.count && params.count > 0) {
      fallback = fallback.slice(0, params.count);
    }

    return fallback;
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Get genre name by ID.
 * Searches the combined fallback (movie + TV).
 */
export function getGenreNameById(id: number): string {
  const genre = FALLBACK_ALL_GENRES.find((g) => g.id === id);
  return genre?.name || `Genre ${id}`;
}

/**
 * Get genre name by ID, scoped to a specific media type.
 * Use this when you know whether the ID came from a movie or TV.
 */
export function getGenreNameByIdTyped(
  id: number,
  type: 'movie' | 'tv'
): string {
  const list = type === 'movie' ? FALLBACK_MOVIE_GENRES : FALLBACK_TV_GENRES;
  const genre = list.find((g) => g.id === id);
  return genre?.name || `Genre ${id}`;
}

/**
 * Get genre names from genre IDs
 */
export function getGenreNamesByIds(ids: number[]): string[] {
  return ids.map((id) => getGenreNameById(id));
}

/**
 * Map genre IDs to genre objects using provided genre list or combined fallback
 */
export function mapGenreIdsToObjects(
  ids: number[],
  genreList: TMDBGenre[] = FALLBACK_ALL_GENRES
): TMDBGenre[] {
  return ids
    .map((id) => genreList.find((g) => g.id === id))
    .filter((g): g is TMDBGenre => g !== undefined);
}

// ============================================
// HOME PAGE SPECIFIC
// ============================================

/**
 * Get genres for home page — uses the correct list by media type
 */
export async function getHomeGenres(
  count: number = 4,
  type: 'movie' | 'tv' = 'movie'
): Promise<TMDBGenre[]> {
  if (type === 'tv') {
    return getTVGenres({ count });
  }
  return getMovieGenres({ count });
}