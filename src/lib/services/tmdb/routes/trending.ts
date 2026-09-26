/**
 * Trending Endpoint Service
 * /trending/{media_type}/{time_window}
 *
 * Official Docs: https://developers.themoviedb.org/3/trending/get-trending
 *
 * Media Types: 'all', 'movie', 'tv', 'person'
 * Time Windows: 'day', 'week'
 */

import { CACHE_CONFIG, HOME_CONFIG } from "@/lib/config/app.config";
import type { TMDBMovie } from "@/types/movie.types";
import type { TMDBPerson } from "@/types/person.types";
import type {
  TrendingItem,
  TrendingParams,
  TrendingResponse,
} from "@/types/trending.types";
import type { TMDBTV } from "@/types/tv.types";
import { tmdbClient } from "../client";

// ============================================
// TYPE GUARDS (re-exported from types for convenience)
// ============================================

export {
  isTrendingMovie,
  isTrendingPerson,
  isTrendingTV,
} from "@/types/trending.types";

// ============================================
// MAIN FETCH FUNCTION
// ============================================

/**
 * Fetch trending content from TMDB
 *
 * @param params - Trending parameters
 * @param params.media_type - 'all' | 'movie' | 'tv' | 'person' (default: 'all')
 * @param params.time_window - 'day' | 'week' (default: 'week')
 * @param params.language - Language code (default: 'en-US')
 * @param params.page - Page number (default: 1)
 * @param params.adult - Include adult content (default: false)
 * @param params.region - Region code (default: 'US')
 * @param options - Client options (cache, retry, timeout)
 *
 * @returns Trending response with results array
 * @returns null if request fails
 *
 * @example
 * ```ts
 * // Get all trending for the week
 * const trending = await getTrending({
 *   media_type: 'all',
 *   time_window: 'week',
 *   limit: 10
 * });
 *
 * // Get trending movies only
 * const movies = await getTrending({
 *   media_type: 'movie',
 *   time_window: 'day'
 * });
 * ```
 */
export async function getTrending(
  params: TrendingParams = {},
  options: {
    limit?: number;
    cache?: RequestCache;
    retryAttempts?: number;
    timeout?: number;
  } = {},
): Promise<TrendingItem[] | null> {
  try {
    const {
      media_type = "all",
      time_window = "week",
      language = "en-US",
      page = 1,
      adult = false,
      region = "US",
    } = params;

    const { limit, cache, retryAttempts, timeout } = options;

    const response = await tmdbClient.fetch<TrendingResponse>(
      `/trending/${media_type}/${time_window}`,
      {
        language,
        page,
        region,
      },
      {
        cache: cache ?? "force-cache",
        next: {
          revalidate: CACHE_CONFIG.revalidation.trending,
          tags: [CACHE_CONFIG.tags.trending],
        },
        retryAttempts,
        timeout,
      },
    );

    let results = response.results;

    // Filter adult content if false
    if (!adult) {
      results = results.filter((item) => {
        // Check if item has 'adult' property (movies and people)
        if ("adult" in item) {
          return !item.adult;
        }
        return true;
      });
    }

    // Apply limit if provided
    if (limit && limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  } catch (error) {
    console.error("[TMDB] Failed to fetch trending:", error);
    return null;
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Get trending movies only
 */
export async function getTrendingMovies(
  time_window: "day" | "week" = "week",
  limit: number = 10,
): Promise<TMDBMovie[] | null> {
  const results = await getTrending(
    {
      media_type: "movie",
      time_window,
      adult: false,
    },
    { limit },
  );

  if (!results) return null;

  // Type assertion: all items are movies (filtered by media_type)
  return results.filter((item) => item.media_type === "movie") as TMDBMovie[];
}

/**
 * Get trending TV shows only
 */
export async function getTrendingTV(
  time_window: "day" | "week" = "week",
  limit: number = 10,
): Promise<TMDBTV[] | null> {
  const results = await getTrending(
    {
      media_type: "tv",
      time_window,
      adult: false,
    },
    { limit },
  );

  if (!results) return null;

  return results.filter((item) => item.media_type === "tv") as TMDBTV[];
}

/**
 * Get trending people only
 */
export async function getTrendingPeople(
  time_window: "day" | "week" = "week",
  limit: number = 20,
): Promise<TMDBPerson[] | null> {
  const results = await getTrending(
    {
      media_type: "person",
      time_window,
      adult: false,
    },
    { limit },
  );

  if (!results) return null;

  return results.filter((item) => item.media_type === "person") as TMDBPerson[];
}

// ============================================
// HOME PAGE SPECIFIC (Convenience)
// ============================================

/**
 * Get trending data specifically for the hero carousel
 * Combines movies and TV shows, sorted by popularity
 */
export async function getHeroTrending(
  limit: number = HOME_CONFIG.hero.itemCount,
): Promise<TrendingItem[] | null> {
  return getTrending(
    {
      media_type: "all",
      time_window: "week",
      adult: HOME_CONFIG.hero.adult,
    },
    { limit },
  );
}
