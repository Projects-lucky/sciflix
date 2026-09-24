/**
 * TMDB Services - Unified Exports
 * 
 * Central entry point for all TMDB API services
 * Import from this file to access all TMDB functionality
 * 
 * @example
 * ```ts
 * import { getTrending, discoverMovies, getMovieDetails } from '@/lib/services/tmdb';
 * ```
 */

// ============================================
// CLIENT
// ============================================

export { tmdbClient, tmdbFetch, TMDBServiceError } from './client';
export type { TMDBClientOptions } from './client';

// ============================================
// ROUTES - TRENDING
// ============================================

export {
  getTrending,
  getTrendingMovies,
  getTrendingTV,
  getTrendingPeople,
  getHeroTrending,
  isTrendingMovie,
  isTrendingTV,
  isTrendingPerson,
} from './routes/trending';

// ============================================
// ROUTES - DISCOVER
// ============================================

export {
  discoverMovies,
  discoverTV,
  getMoviesByGenre,
  getMoviesByGenres,
  getTVByGenre,
  getLatestMovies,
  getTopRatedMovies,
  getGenreSections,
} from './routes/discover';

// ============================================
// ROUTES - GENRES
// ============================================

export {
  getMovieGenres,
  getTVGenres,
  getHomeGenres,
  getGenreNameById,
  getGenreNamesByIds,
  mapGenreIdsToObjects,
  FALLBACK_GENRES,
} from './routes/genres';

// ============================================
// ROUTES - DETAILS
// ============================================

export {
  getMovieDetails,
  getMovieCredits,
  getMovieWithCredits,
  getTVDetails,
  getTVCredits,
  getTVWithCredits,
  getPersonDetails,
  getPersonWithCredits,
  getMultipleMovieDetails,
} from './routes/details';

// ============================================
// ROUTES - SEARCH
// ============================================

export {
  searchMulti,
  searchMovies,
  searchTV,
  searchPeople,
  searchAll,
  searchMedia,
  isSearchMovie,
  isSearchTV,
  isSearchPerson,
} from './routes/search';

// ============================================
// ROUTES - MULTI/FIND
// ============================================

export {
  findByExternalId,
  findMovieByImdb,
  findTVByImdb,
  findPersonByImdb,
  findByTVDB,
  findByFacebook,
  findByInstagram,
  findByTwitter,
} from './routes/multi';
export type { FindExternalSource, FindResponse, FindParams } from './routes/multi';