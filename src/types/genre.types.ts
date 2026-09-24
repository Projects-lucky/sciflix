/**
 * Genre Endpoint Types
 * /genre/movie/list, /genre/tv/list
 */

import type { TMDBGenre } from './tmdb.types';

// ============================================
// GENRE LIST RESPONSE
// ============================================

export interface GenreListResponse {
  genres: TMDBGenre[];
}

// ============================================
// GENRE REQUEST PARAMETERS
// ============================================

export interface GenreParams {
  language?: string;
}