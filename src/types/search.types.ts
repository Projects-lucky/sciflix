/**
 * Search Endpoint Types
 * /search/multi, /search/movie, /search/tv, /search/person
 */

import type { TMDBMovie } from "./movie.types";
import type { TMDBPerson } from "./person.types";
import type { TMDBTV } from "./tv.types";

// ============================================
// SEARCH REQUEST PARAMETERS
// ============================================

export interface SearchParams {
  query: string;
  page?: number;
  language?: string;
  region?: string;
  adult?: boolean;
  year?: number;
  primary_release_year?: number;
  first_air_date_year?: number;
}

// ============================================
// SEARCH RESPONSES
// ============================================

export interface SearchMovieResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface SearchTVResponse {
  page: number;
  results: TMDBTV[];
  total_pages: number;
  total_results: number;
}

export interface SearchPersonResponse {
  page: number;
  results: TMDBPerson[];
  total_pages: number;
  total_results: number;
}

// ============================================
// SEARCH MULTI
// ============================================

export type SearchMultiItem = (TMDBMovie | TMDBTV | TMDBPerson) & {
  media_type: "movie" | "tv" | "person";
};

export interface SearchMultiResponse {
  page: number;
  results: SearchMultiItem[];
  total_pages: number;
  total_results: number;
}
