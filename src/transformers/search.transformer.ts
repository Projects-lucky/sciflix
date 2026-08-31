/**
 * Search Transformers
 * 
 * Transforms raw TMDB search results into UI-friendly formats.
 * Handles movies, TV shows, and people with consistent structure.
 * Provides grouping by media type for categorized displays.
 */

import { buildImageUrl, getYearFromDate } from './common'

// Transformed Search Result
export interface TransformedSearchResult {
  id: number
  title: string
  poster: string | null
  rating: number
  year: string
  mediaType: 'movie' | 'tv' | 'person'
  overview?: string
  department?: string // For people
}

/**
 * Transforms search results into a consistent format
 * 
 * @param results - Array of raw search results
 * @returns Array of transformed search results
 */
export function transformSearchResults(results: any[]): TransformedSearchResult[] {
  return results.map((item) => {
    const isPerson = item.media_type === 'person'
    const isMovie = item.media_type === 'movie'
    const isTV = item.media_type === 'tv'

    return {
      id: item.id,
      title: item.title || item.name || 'Unknown',
      poster: isPerson
        ? buildImageUrl(item.profile_path, 'w185')
        : buildImageUrl(item.poster_path, 'w185'),
      rating: item.vote_average || 0,
      year: isPerson
        ? 'N/A'
        : getYearFromDate(item.release_date || item.first_air_date),
      mediaType: item.media_type || 'movie',
      overview: item.overview || item.biography,
      department: isPerson ? item.known_for_department : undefined,
    }
  })
}

/**
 * Groups search results by media type
 * 
 * @param results - Array of transformed search results
 * @returns Object with movies, tv, and people arrays
 */
export function groupSearchResults(results: TransformedSearchResult[]): {
  movies: TransformedSearchResult[]
  tv: TransformedSearchResult[]
  people: TransformedSearchResult[]
} {
  return {
    movies: results.filter((item) => item.mediaType === 'movie'),
    tv: results.filter((item) => item.mediaType === 'tv'),
    people: results.filter((item) => item.mediaType === 'person'),
  }
}