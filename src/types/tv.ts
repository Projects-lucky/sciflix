/**
 * TV Types
 * 
 * Type definitions for TMDB TV show data.
 * Includes TVShow, TVDetails, TVResponse, and credit types.
 */

export interface TVShow {
  id: number
  name: string
  original_name: string
  overview: string | null
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string | null
  vote_average: number
  vote_count: number
  popularity: number
  genres: Array<{ id: number; name: string }>
  origin_country: string[]
  original_language: string
}

export interface Network {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface CreatedBy {
  id: number
  credit_id: string
  name: string
  gender: number
  profile_path: string | null
}

export interface LastEpisodeToAir {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: string | null
  episode_number: number
  production_code: string
  runtime: number | null
  season_number: number
  show_id: number
  still_path: string | null
}

export interface TVSeason {
  air_date: string | null
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  vote_average: number
}

export interface TVDetails extends TVShow {
  created_by: CreatedBy[]
  episode_run_time: number[]
  homepage: string | null
  in_production: boolean
  languages: string[]
  last_air_date: string | null
  last_episode_to_air: LastEpisodeToAir | null
  next_episode_to_air: null | any
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  production_companies: Array<{
    id: number
    logo_path: string | null
    name: string
    origin_country: string
  }>
  production_countries: Array<{
    iso_3166_1: string
    name: string
  }>
  seasons: TVSeason[]
  spoken_languages: Array<{
    english_name: string
    iso_639_1: string
    name: string
  }>
  status: string
  tagline: string | null
  type: string
}

export interface TVResponse {
  page: number
  results: TVShow[]
  total_pages: number
  total_results: number
}

export interface TVFilters {
  page?: number
  sort_by?: string
  with_genres?: string | number
  year?: number
  "vote_average.gte"?: number
  include_adult?: boolean
}

export interface TVActorCredit {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  character: string
  credit_id: string
  order: number
}

export interface TVCrewCredit {
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

export interface TVCreditsResponse {
  id: number
  cast: TVActorCredit[]
  crew: TVCrewCredit[]
}