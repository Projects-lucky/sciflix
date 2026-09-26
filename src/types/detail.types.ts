/**
 * Detail Endpoint Types
 * Request parameters only - actual responses imported from movie/tv/person types
 */

// ============================================
// DETAIL REQUEST PARAMETERS
// ============================================

export interface DetailParams {
  language?: string;
  append_to_response?: string;
}

// Re-export actual detail types from their respective files
export type { TMDBMovieDetail as MovieDetail } from "./movie.types";
export type { TMDBPersonDetail as PersonDetail } from "./person.types";
export type { TMDBTVDetail as TVDetail } from "./tv.types";
