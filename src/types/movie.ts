/**
 * Movie Types
 * 
 * Type definitions for TMDB movie data.
 * Includes Movie, MovieDetails, MovieResponse, and credit types.
 */

export interface Movie {
  id: number
  title: string
  overview: string | null
  poster_path: string | null
  backdrop_path: string | null
  release_date: string | null
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  video: boolean
}

export interface CollectionInfo {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface MovieDetails extends Movie {
  belongs_to_collection: CollectionInfo | null
  budget: number
  genres: Array<{ id: number; name: string }>
  homepage: string | null
  imdb_id: string | null
  production_companies: Array<{
    id: number
    name: string
    logo_path: string | null
    origin_country: string
  }>
  production_countries: Array<{
    iso_3166_1: string
    name: string
  }>
  revenue: number
  runtime: number | null
  spoken_languages: Array<{
    iso_639_1: string
    name: string
  }>
  status: string
  tagline: string | null
}

export interface MovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface MovieFilters {
  page?: number
  sort_by?: string
  with_genres?: string | number
  year?: number
  "vote_average.gte"?: number
  "vote_average.lte"?: number
  with_original_language?: string
  include_adult?: boolean
}

// Actor credit type
export interface TMDBActorCredit {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  cast_id: number
  character: string
  credit_id: string
  order: number
}

// Crew credit type
export interface TMDBCrewCredit {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  credit_id: string
  department: string
  job: string
}

export interface MovieCreditsResponse {
  id: number
  cast: TMDBActorCredit[]
  crew: TMDBCrewCredit[]
}