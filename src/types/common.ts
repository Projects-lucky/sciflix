/**
 * Common Types
 * 
 * Shared type definitions used across multiple transformers and components.
 * Includes universal media type and a flexible raw payload interface
 * for TMDB API responses.
 */

export type UniversalMediaType = 'movie' | 'tv' | 'person'

export interface TMDBRawPayload {
  id: number
  media_type?: UniversalMediaType
  title?: string // Movie Title
  name?: string // TV or Person Name
  poster_path?: string | null // Movie/TV Image
  profile_path?: string | null // Person Image
  vote_average?: number // Movie/TV Rating
  release_date?: string // Movie Date
  first_air_date?: string // TV Date
  known_for_department?: string // Person Role/Department

  // Backward compatibility with legacy frontend transformers
  poster?: string | null
  rating?: number | string
  year?: string | number
}