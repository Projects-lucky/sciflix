/**
 * TMDB API Base Type Definitions
 * ONLY common types shared across all endpoints
 * No Movie, TV, or Person definitions here
 */

// ============================================
// PAGINATION (Common wrapper)
// ============================================

export interface TMDBApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// ============================================
// IMAGE (Common)
// ============================================

export interface TMDBImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBImageConfig {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
}

export interface TMDBConfigurationResponse {
  images: TMDBImageConfig;
  change_keys: string[];
}

// ============================================
// MEDIA TYPE DISCRIMINATOR (Common)
// ============================================

export type TMDBMediaType = "movie" | "tv" | "person";

// ============================================
// GENRE (Common)
// ============================================

export interface TMDBGenre {
  id: number;
  name: string;
}

// ============================================
// CREDITS (Common - used by both Movie & TV)
// ============================================

export interface TMDBCastMember {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface TMDBCrewMember {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface TMDBCredits {
  id: number;
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

// ============================================
// PRODUCTION (Common - used by Movie & TV)
// ============================================

export interface TMDBProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// ============================================
// DATE RANGE (Common)
// ============================================

export interface TMDBDateRange {
  maximum: string;
  minimum: string;
}

// ============================================
// EXTERNAL IDS (Common)
// ============================================

export interface TMDBExternalIds {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  id: number;
}

// ============================================
// VIDEOS (Common)
// ============================================

export interface TMDBVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface TMDBVideosResponse {
  id: number;
  results: TMDBVideo[];
}
