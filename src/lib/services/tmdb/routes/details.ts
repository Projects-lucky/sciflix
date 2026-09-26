/**
 * Details Endpoint Service
 * /movie/{id}, /tv/{id}, /person/{id}
 *
 * Official Docs:
 * - Movie: https://developers.themoviedb.org/3/movies/get-movie-details
 * - TV: https://developers.themoviedb.org/3/tv/get-tv-details
 * - Person: https://developers.themoviedb.org/3/people/get-person-details
 *
 * Fetches full details for a single entity with optional credits
 */

import { CACHE_CONFIG } from "@/lib/config/app.config";
import type { DetailParams } from "@/types/detail.types";
import type {
  MovieCreditsResponse,
  TMDBMovieDetail,
} from "@/types/movie.types";
import type { TMDBPersonDetail } from "@/types/person.types";
import type { TMDBCredits } from "@/types/tmdb.types";
import type { TMDBTVDetail } from "@/types/tv.types";
import { tmdbClient } from "../client";

// ============================================
// MOVIE DETAILS
// ============================================

/**
 * Get full movie details by ID
 *
 * @param id - Movie ID
 * @param params - Optional parameters (language, append_to_response)
 * @param options - Client options (cache, retry, timeout)
 *
 * @returns Movie details or null if fails
 *
 * @example
 * ```ts
 * // Get basic movie details
 * const movie = await getMovieDetails(12345);
 *
 * // Get movie with credits
 * const movie = await getMovieDetails(12345, {
 *   append_to_response: 'credits'
 * });
 *
 * // Get movie with credits, images, and videos
 * const movie = await getMovieDetails(12345, {
 *   append_to_response: 'credits,images,videos'
 * });
 * ```
 */
export async function getMovieDetails(
  id: number,
  params: DetailParams = {},
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<TMDBMovieDetail | null> {
  try {
    const { language = "en-US", append_to_response } = params;
    const { cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<TMDBMovieDetail>(
      `/movie/${id}`,
      {
        language,
        append_to_response,
      },
      {
        cache: cache ?? "force-cache",
        next: {
          revalidate: CACHE_CONFIG.revalidation.details,
          tags: [`movie-${id}`],
        },
        retryAttempts,
        timeout,
      },
    );

    return response;
  } catch (error) {
    console.error(`[TMDB] Failed to fetch movie details for ID ${id}:`, error);
    return null;
  }
}

/**
 * Get movie credits (cast and crew) by movie ID
 *
 * @param id - Movie ID
 * @param options - Client options
 * @returns Credits or null if fails
 */
export async function getMovieCredits(
  id: number,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<MovieCreditsResponse | null> {
  try {
    const { cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<MovieCreditsResponse>(
      `/movie/${id}/credits`,
      {
        language: "en-US",
      },
      {
        cache: cache ?? "force-cache",
        next: {
          revalidate: CACHE_CONFIG.revalidation.details,
          tags: [`movie-${id}-credits`],
        },
        retryAttempts,
        timeout,
      },
    );

    return response;
  } catch (error) {
    console.error(`[TMDB] Failed to fetch movie credits for ID ${id}:`, error);
    return null;
  }
}

// ============================================
// TV DETAILS
// ============================================

/**
 * Get full TV details by ID
 *
 * @param id - TV ID
 * @param params - Optional parameters (language, append_to_response)
 * @param options - Client options
 * @returns TV details or null if fails
 *
 * @example
 * ```ts
 * // Get basic TV details
 * const tv = await getTVDetails(12345);
 *
 * // Get TV with credits
 * const tv = await getTVDetails(12345, {
 *   append_to_response: 'credits'
 * });
 * ```
 */
export async function getTVDetails(
  id: number,
  params: DetailParams = {},
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<TMDBTVDetail | null> {
  try {
    const { language = "en-US", append_to_response } = params;
    const { cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<TMDBTVDetail>(
      `/tv/${id}`,
      {
        language,
        append_to_response,
      },
      {
        cache: cache ?? "force-cache",
        next: {
          revalidate: CACHE_CONFIG.revalidation.details,
          tags: [`tv-${id}`],
        },
        retryAttempts,
        timeout,
      },
    );

    return response;
  } catch (error) {
    console.error(`[TMDB] Failed to fetch TV details for ID ${id}:`, error);
    return null;
  }
}

/**
 * Get TV credits (cast and crew) by TV ID
 *
 * @param id - TV ID
 * @param options - Client options
 * @returns Credits or null if fails
 */
export async function getTVCredits(
  id: number,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<TMDBCredits | null> {
  try {
    const { cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<TMDBCredits>(
      `/tv/${id}/credits`,
      {
        language: "en-US",
      },
      {
        cache: cache ?? "force-cache",
        next: {
          revalidate: CACHE_CONFIG.revalidation.details,
          tags: [`tv-${id}-credits`],
        },
        retryAttempts,
        timeout,
      },
    );

    return response;
  } catch (error) {
    console.error(`[TMDB] Failed to fetch TV credits for ID ${id}:`, error);
    return null;
  }
}

// ============================================
// PERSON DETAILS
// ============================================

/**
 * Get full person details by ID
 *
 * @param id - Person ID
 * @param params - Optional parameters (language, append_to_response)
 * @param options - Client options
 * @returns Person details or null if fails
 *
 * @example
 * ```ts
 * // Get basic person details
 * const person = await getPersonDetails(12345);
 *
 * // Get person with movie credits
 * const person = await getPersonDetails(12345, {
 *   append_to_response: 'movie_credits'
 * });
 * ```
 */
export async function getPersonDetails(
  id: number,
  params: DetailParams = {},
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<TMDBPersonDetail | null> {
  try {
    const { language = "en-US", append_to_response } = params;
    const { cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<TMDBPersonDetail>(
      `/person/${id}`,
      {
        language,
        append_to_response,
      },
      {
        cache: cache ?? "force-cache",
        next: {
          revalidate: CACHE_CONFIG.revalidation.details,
          tags: [`person-${id}`],
        },
        retryAttempts,
        timeout,
      },
    );

    return response;
  } catch (error) {
    console.error(`[TMDB] Failed to fetch person details for ID ${id}:`, error);
    return null;
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Get movie with credits in one call
 */
export async function getMovieWithCredits(
  id: number,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<(TMDBMovieDetail & { credits: TMDBCredits }) | null> {
  const movie = await getMovieDetails(
    id,
    { append_to_response: "credits" },
    options,
  );

  if (!movie || !movie.credits) {
    return null;
  }

  return movie as TMDBMovieDetail & { credits: TMDBCredits };
}

/**
 * Get TV with credits in one call
 */
export async function getTVWithCredits(
  id: number,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<(TMDBTVDetail & { credits: TMDBCredits }) | null> {
  const tv = await getTVDetails(id, { append_to_response: "credits" }, options);

  if (!tv || !tv.credits) {
    return null;
  }

  return tv as TMDBTVDetail & { credits: TMDBCredits };
}

/**
 * Get person with movie credits in one call
 */
export async function getPersonWithCredits(
  id: number,
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<TMDBPersonDetail | null> {
  return getPersonDetails(id, { append_to_response: "movie_credits" }, options);
}

/**
 * Get multiple movie details in parallel
 * @param ids - Array of movie IDs
 * @returns Array of movie details (null for failed ones)
 */
export async function getMultipleMovieDetails(
  ids: number[],
  params: DetailParams = {},
  options: {
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<Array<{ id: number; data: TMDBMovieDetail | null }>> {
  const results = await Promise.allSettled(
    ids.map((id) => getMovieDetails(id, params, options)),
  );

  return results.map((result, index) => ({
    id: ids[index],
    data: result.status === "fulfilled" ? result.value : null,
  }));
}
