/**
 * Genre Types
 * 
 * Type definitions for TMDB genre data.
 * Used across movies, TV shows, and filter components.
 */

export interface Genre {
  id: number
  name: string
}

export interface GenresResponse {
  genres: Genre[]
}