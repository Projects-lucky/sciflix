/**
 * Trending Endpoint Types
 * /trending/{media_type}/{time_window}
 */

import type { TMDBMovie } from './movie.types';
import type { TMDBTV } from './tv.types';
import type { TMDBPerson } from './person.types';
import type { TMDBMediaType } from './tmdb.types';

// ============================================
// TRENDING ITEMS (UNION WITH MEDIA_TYPE)
// ============================================

export type TrendingMovie = TMDBMovie & {
  media_type: 'movie';
};

export type TrendingTV = TMDBTV & {
  media_type: 'tv';
};

export type TrendingPerson = TMDBPerson & {
  media_type: 'person';
};

export type TrendingItem = TrendingMovie | TrendingTV | TrendingPerson;

// ============================================
// TRENDING RESPONSE
// ============================================

export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}

// ============================================
// TRENDING REQUEST PARAMETERS
// ============================================

export interface TrendingParams {
  media_type?: 'all' | 'movie' | 'tv' | 'person';
  time_window?: 'day' | 'week';
  language?: string;
  page?: number;
  adult?: boolean;
  region?: string;
}

// ============================================
// TYPE GUARDS
// ============================================

export function isTrendingMovie(item: TrendingItem): item is TrendingMovie {
  return item.media_type === 'movie';
}

export function isTrendingTV(item: TrendingItem): item is TrendingTV {
  return item.media_type === 'tv';
}

export function isTrendingPerson(item: TrendingItem): item is TrendingPerson {
  return item.media_type === 'person';
}