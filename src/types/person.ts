/**
 * Person Types
 * 
 * Type definitions for TMDB person/celebrity data.
 * Includes Person, PersonDetails, credits, and filmography types.
 */

export interface KnownForMedia {
  adult: boolean
  backdrop_path: string | null
  id: number
  // Movie specific
  title?: string
  original_title?: string
  release_date?: string
  video?: boolean
  // TV specific
  name?: string
  original_name?: string
  first_air_date?: string
  origin_country?: string[]
  // Shared
  original_language: string
  overview: string
  poster_path: string | null
  media_type: 'movie' | 'tv'
  genre_ids: number[]
  popularity: number
  vote_average: number
  vote_count: number
}

export interface Person {
  adult: boolean
  id: number
  name: string
  original_name: string
  media_type: 'person'
  popularity: number
  gender: number
  readonly department?: string
  known_for_department: string
  profile_path: string | null
  profile?: string | null
  poster?: string | null
  known_for?: KnownForMedia[]
  knownFor?: KnownForMedia[]
}

export interface PersonDetails extends Person {
  biography: string | null
  birthday: string | null
  profile: string | null
  deathday: string | null
  place_of_birth: string | null
  also_known_as: string[]
  imdb_id: string | null
  homepage: string | null
  filmography: FilmographyItem[]
}

export interface PersonSearchResponse {
  page: number
  results: Person[]
  total_pages: number
  total_results: number
}

export interface PersonMovieCredits {
  cast: Array<{
    id: number
    title: string
    release_date: string
    poster_path: string | null
    character: string
    vote_average: number
  }>
  crew: Array<{
    id: number
    title: string
    release_date: string
    poster_path: string | null
    job: string
    department: string
  }>
}

export interface PersonTVCredits {
  cast: Array<{
    id: number
    name: string
    first_air_date: string
    poster_path: string | null
    character: string
    episode_count: number
  }>
  crew: Array<{
    id: number
    name: string
    first_air_date: string
    poster_path: string | null
    job: string
    department: string
  }>
}

export interface PersonCombinedCredits {
  cast: Array<{
    id: number
    media_type: 'movie' | 'tv'
    title?: string
    name?: string
    release_date?: string
    first_air_date?: string
    poster_path: string | null
    character: string
    vote_average: number
  }>
  crew: Array<{
    id: number
    media_type: 'movie' | 'tv'
    title?: string
    name?: string
    release_date?: string
    first_air_date?: string
    poster_path: string | null
    job: string
    department: string
  }>
}

export interface FilmographyItem {
  id: number
  title: string
  character?: string
  job?: string
  mediaType: 'movie' | 'tv'
  poster: string | null
  year: string
}