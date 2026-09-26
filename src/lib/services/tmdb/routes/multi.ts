/**
 * Multi/Find Endpoint Service
 * /find/{external_id}
 *
 * Official Docs: https://developers.themoviedb.org/3/find/find-by-id
 *
 * Find movies, TV shows, or people by external IDs
 * Supports: IMDb, TVDB, Facebook, Instagram, Twitter, etc.
 */

import { CACHE_CONFIG } from "@/lib/config/app.config";
import type { TMDBMovie } from "@/types/movie.types";
import type { TMDBPerson } from "@/types/person.types";
import type { TMDBTV } from "@/types/tv.types";
import { tmdbClient } from "../client";

// ============================================
// TYPES
// ============================================

export type FindExternalSource =
  | "imdb_id"
  | "tvdb_id"
  | "facebook_id"
  | "instagram_id"
  | "twitter_id";

export interface FindResponse {
  movie_results: TMDBMovie[];
  tv_results: TMDBTV[];
  person_results: TMDBPerson[];
  tv_episode_results: unknown[];
  tv_season_results: unknown[];
}

export interface FindParams {
  language?: string;
  external_source: FindExternalSource;
}

// ============================================
// MAIN FETCH FUNCTIONS
// ============================================

/**
 * Find content by external ID
 *
 * @param externalId - The external ID (e.g., 'tt1375666' for IMDb)
 * @param externalSource - The source type (e.g., 'imdb_id')
 * @param params - Optional parameters (language)
 * @param options - Client options (cache, retry, timeout)
 *
 * @returns FindResponse with movie_results, tv_results, person_results
 * @returns null if request fails
 *
 * @example
 * ```ts
 * // Find by IMDb ID (Inception)
 * const result = await findByExternalId('tt1375666', 'imdb_id');
 * // result.movie_results contains the movie
 *
 * // Find by TVDB ID
 * const result = await findByExternalId('12345', 'tvdb_id');
 * ```
 */
export async function findByExternalId(
  externalId: string,
  externalSource: FindExternalSource,
  params: { language?: string } = {},
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<FindResponse | null> {
  try {
    const { language = "en-US" } = params;
    const { cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<FindResponse>(
      `/find/${externalId}`,
      {
        external_source: externalSource,
        language,
      },
      {
        cache: cache ?? "force-cache",
        next: {
          revalidate: CACHE_CONFIG.revalidation.details,
          tags: [`external-${externalSource}-${externalId}`],
        },
        retryAttempts,
        timeout,
      },
    );

    return response;
  } catch (error) {
    console.error(
      `[TMDB] Failed to find by ${externalSource}:${externalId}:`,
      error,
    );
    return null;
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Find movie by IMDb ID
 *
 * @param imdbId - IMDb ID (e.g., 'tt1375666' for Inception)
 * @param options - Client options
 * @returns First movie result or null
 *
 * @example
 * ```ts
 * const movie = await findMovieByImdb('tt1375666');
 * ```
 */
export async function findMovieByImdb(
  imdbId: string,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<TMDBMovie | null> {
  const result = await findByExternalId(imdbId, "imdb_id", {}, options);
  return result?.movie_results?.[0] || null;
}

/**
 * Find TV show by IMDb ID
 *
 * @param imdbId - IMDb ID (e.g., 'tt0903747' for Breaking Bad)
 * @param options - Client options
 * @returns First TV result or null
 *
 * @example
 * ```ts
 * const tv = await findTVByImdb('tt0903747');
 * ```
 */
export async function findTVByImdb(
  imdbId: string,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<TMDBTV | null> {
  const result = await findByExternalId(imdbId, "imdb_id", {}, options);
  return result?.tv_results?.[0] || null;
}

/**
 * Find person by IMDb ID
 *
 * @param imdbId - IMDb ID (e.g., 'nm0000138' for Leonardo DiCaprio)
 * @param options - Client options
 * @returns First person result or null
 *
 * @example
 * ```ts
 * const person = await findPersonByImdb('nm0000138');
 * ```
 */
export async function findPersonByImdb(
  imdbId: string,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<TMDBPerson | null> {
  const result = await findByExternalId(imdbId, "imdb_id", {}, options);
  return result?.person_results?.[0] || null;
}

/**
 * Find by TVDB ID
 *
 * @param tvdbId - TVDB ID
 * @param options - Client options
 * @returns FindResponse or null
 */
export async function findByTVDB(
  tvdbId: string,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<FindResponse | null> {
  return findByExternalId(tvdbId, "tvdb_id", {}, options);
}

/**
 * Find by Facebook ID
 *
 * @param facebookId - Facebook ID
 * @param options - Client options
 * @returns FindResponse or null
 */
export async function findByFacebook(
  facebookId: string,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<FindResponse | null> {
  return findByExternalId(facebookId, "facebook_id", {}, options);
}

/**
 * Find by Instagram ID
 *
 * @param instagramId - Instagram ID
 * @param options - Client options
 * @returns FindResponse or null
 */
export async function findByInstagram(
  instagramId: string,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<FindResponse | null> {
  return findByExternalId(instagramId, "instagram_id", {}, options);
}

/**
 * Find by Twitter ID
 *
 * @param twitterId - Twitter ID
 * @param options - Client options
 * @returns FindResponse or null
 */
export async function findByTwitter(
  twitterId: string,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<FindResponse | null> {
  return findByExternalId(twitterId, "twitter_id", {}, options);
}
