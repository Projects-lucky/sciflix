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

export type { TMDBClientOptions } from "./client";
export { TMDBServiceError, tmdbClient, tmdbFetch } from "./client";

// ============================================
// ROUTES - TRENDING
// ============================================

export {
  getHeroTrending,
  getTrending,
  getTrendingMovies,
  getTrendingPeople,
  getTrendingTV,
  isTrendingMovie,
  isTrendingPerson,
  isTrendingTV,
} from "./routes/trending";

// ============================================
// ROUTES - DISCOVER
// ============================================

export {
  discoverMovies,
  discoverTV,
  getGenreSections,
  getLatestMovies,
  getMoviesByGenre,
  getMoviesByGenres,
  getTopRatedMovies,
  getTVByGenre,
} from "./routes/discover";

// ============================================
// ROUTES - GENRES
// ============================================

export {
  FALLBACK_GENRES,
  getGenreNameById,
  getGenreNamesByIds,
  getHomeGenres,
  getMovieGenres,
  getTVGenres,
  mapGenreIdsToObjects,
} from "./routes/genres";

// ============================================
// ROUTES - DETAILS
// ============================================

export {
  getMovieCredits,
  getMovieDetails,
  getMovieWithCredits,
  getMultipleMovieDetails,
  getPersonDetails,
  getPersonWithCredits,
  getTVCredits,
  getTVDetails,
  getTVWithCredits,
} from "./routes/details";

// ============================================
// ROUTES - SEARCH
// ============================================

export {
  isSearchMovie,
  isSearchPerson,
  isSearchTV,
  searchAll,
  searchMedia,
  searchMovies,
  searchMulti,
  searchPeople,
  searchTV,
} from "./routes/search";

// ============================================
// ROUTES - MULTI/FIND
// ============================================

export type {
  FindExternalSource,
  FindParams,
  FindResponse,
} from "./routes/multi";
export {
  findByExternalId,
  findByFacebook,
  findByInstagram,
  findByTVDB,
  findByTwitter,
  findMovieByImdb,
  findPersonByImdb,
  findTVByImdb,
} from "./routes/multi";
