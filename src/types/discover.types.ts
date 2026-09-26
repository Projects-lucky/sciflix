/**
 * Discover Endpoint Types
 * /discover/movie, /discover/tv
 */

import type { TMDBMovie } from "./movie.types";
import type { TMDBTV } from "./tv.types";

// ============================================
// DISCOVER MOVIE PARAMETERS (FULL TMDB SUPPORT)
// ============================================

export interface DiscoverMovieParams {
  // Pagination
  page?: number;
  language?: string;
  region?: string;

  // Filtering
  adult?: boolean;
  with_genres?: string;
  year?: number;
  primary_release_year?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  "release_date.gte"?: string;
  "release_date.lte"?: string;

  // Vote & Rating Filters
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  "vote_count.lte"?: number;

  // Sorting
  sort_by?:
    | "popularity.desc"
    | "popularity.asc"
    | "vote_average.desc"
    | "vote_average.asc"
    | "vote_count.desc"
    | "vote_count.asc"
    | "release_date.desc"
    | "release_date.asc"
    | "revenue.desc"
    | "revenue.asc"
    | "primary_release_date.desc"
    | "primary_release_date.asc"
    | "original_title.desc"
    | "original_title.asc";

  // Additional filters
  with_cast?: string;
  with_crew?: string;
  with_people?: string;
  with_companies?: string;
  with_keywords?: string;
  without_keywords?: string;
  with_runtime?: string; // e.g., "100.200" for 100-200 minutes
  with_original_language?: string;
  without_companies?: string;
  without_genres?: string;
  without_people?: string;
  without_runtime?: string;
  include_adult?: boolean;
  include_video?: boolean;
  with_watch_monetization_types?: string;
  with_watch_providers?: string;
  watch_region?: string;
}

// ============================================
// DISCOVER TV PARAMETERS (FULL TMDB SUPPORT)
// ============================================

export interface DiscoverTVParams {
  page?: number;
  language?: string;
  region?: string;
  adult?: boolean;
  with_genres?: string;
  without_genres?: string;
  first_air_date_year?: number;
  "first_air_date.gte"?: string;
  "first_air_date.lte"?: string;
  "air_date.gte"?: string;
  "air_date.lte"?: string;

  // Vote & Rating Filters
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  "vote_count.lte"?: number;

  // Sorting
  sort_by?:
    | "popularity.desc"
    | "popularity.asc"
    | "vote_average.desc"
    | "vote_average.asc"
    | "vote_count.desc"
    | "vote_count.asc"
    | "first_air_date.desc"
    | "first_air_date.asc"
    | "original_name.desc"
    | "original_name.asc";

  // Additional filters
  with_networks?: string;
  with_companies?: string;
  with_keywords?: string;
  without_keywords?: string;
  with_people?: string;
  with_original_language?: string;
  without_companies?: string;
  with_watch_monetization_types?: string;
  with_watch_providers?: string;
  watch_region?: string;
}

// ============================================
// DISCOVER RESPONSE
// ============================================

export interface DiscoverMovieResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface DiscoverTVResponse {
  page: number;
  results: TMDBTV[];
  total_pages: number;
  total_results: number;
}
