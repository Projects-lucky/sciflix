/**
 * Trending Transformers
 * 
 * Transforms raw TMDB trending data into UI-friendly formats.
 * Handles movies, TV shows, and people with unified structure.
 * Provides type detection, grouping, and response transformation.
 */

import { buildImageUrl, getYearFromDate, truncateText } from './common'

// Transformed Trending Item (Unified)
export interface TransformedTrendingItem {
  id: number
  title: string
  poster: string | null
  backdrop: string | null
  rating: number
  voteCount: number
  popularity: number
  overview: string
  shortOverview: string
  year: string
  mediaType: 'movie' | 'tv' | 'person'
  // Movie specific
  releaseDate?: string
  // TV specific
  firstAirDate?: string
  // Person specific
  name?: string
  department?: string
  profile?: string | null
  knownFor?: Array<{
    id: number
    title: string
    poster: string | null
    mediaType: 'movie' | 'tv'
  }>
  // Raw
  raw: any
}

/**
 * Transforms a trending movie
 * 
 * @param item - Raw movie data
 * @returns Transformed movie item
 */
export function transformTrendingMovie(item: any): TransformedTrendingItem {
  return {
    id: item.id,
    title: item.title,
    poster: buildImageUrl(item.poster_path, 'w342'),
    backdrop: buildImageUrl(item.backdrop_path, 'w1280'),
    rating: item.vote_average || 0,
    voteCount: item.vote_count || 0,
    popularity: item.popularity || 0,
    overview: item.overview || 'No overview available.',
    shortOverview: truncateText(item.overview, 120),
    year: getYearFromDate(item.release_date),
    mediaType: 'movie',
    releaseDate: item.release_date,
    raw: item,
  }
}

/**
 * Transforms a trending TV show
 * 
 * @param item - Raw TV data
 * @returns Transformed TV item
 */
export function transformTrendingTV(item: any): TransformedTrendingItem {
  return {
    id: item.id,
    title: item.name,
    poster: buildImageUrl(item.poster_path, 'w342'),
    backdrop: buildImageUrl(item.backdrop_path, 'w1280'),
    rating: item.vote_average || 0,
    voteCount: item.vote_count || 0,
    popularity: item.popularity || 0,
    overview: item.overview || 'No overview available.',
    shortOverview: truncateText(item.overview, 120),
    year: getYearFromDate(item.first_air_date),
    mediaType: 'tv',
    firstAirDate: item.first_air_date,
    raw: item,
  }
}

/**
 * Transforms a trending person
 * 
 * @param item - Raw person data
 * @returns Transformed person item
 */
export function transformTrendingPerson(item: any): TransformedTrendingItem {
  return {
    id: item.id,
    title: item.name,
    name: item.name,
    poster: buildImageUrl(item.profile_path, 'w185'),
    backdrop: null,
    profile: buildImageUrl(item.profile_path, 'w185'),
    rating: 0,
    voteCount: 0,
    popularity: item.popularity || 0,
    overview: item.biography || 'No biography available.',
    shortOverview: truncateText(item.biography, 120),
    year: 'N/A',
    mediaType: 'person',
    department: item.known_for_department || 'Actor',
    knownFor: (item.known_for || []).map((kf: any) => ({
      id: kf.id,
      title: kf.title || kf.name || 'Unknown',
      poster: buildImageUrl(kf.poster_path, 'w92'),
      mediaType: kf.media_type || 'movie',
    })),
    raw: item,
  }
}

/**
 * Auto-detects type and transforms any trending item
 * 
 * @param item - Raw trending item
 * @returns Transformed trending item
 */
export function transformTrendingItem(item: any): TransformedTrendingItem {
  if (item.media_type === 'movie') {
    return transformTrendingMovie(item)
  }
  if (item.media_type === 'tv') {
    return transformTrendingTV(item)
  }
  if (item.media_type === 'person') {
    return transformTrendingPerson(item)
  }
  
  // Fallback: detect by properties
  if (item.title && item.release_date) {
    return transformTrendingMovie({ ...item, media_type: 'movie' })
  }
  if (item.name && item.first_air_date) {
    return transformTrendingTV({ ...item, media_type: 'tv' })
  }
  if (item.name && item.profile_path) {
    return transformTrendingPerson({ ...item, media_type: 'person' })
  }
  
  // Final fallback: treat as movie
  return transformTrendingMovie({ ...item, media_type: 'movie' })
}

/**
 * Transforms a list of trending items
 * 
 * @param items - Array of raw trending items
 * @returns Array of transformed trending items
 */
export function transformTrendingList(items: any[]): TransformedTrendingItem[] {
  return items.map(transformTrendingItem)
}

/**
 * Groups trending items by media type
 * 
 * @param items - Array of transformed trending items
 * @returns Object with movies, tv, and people arrays
 */
export function groupTrendingItems(items: TransformedTrendingItem[]): {
  movies: TransformedTrendingItem[]
  tv: TransformedTrendingItem[]
  people: TransformedTrendingItem[]
} {
  return {
    movies: items.filter((item) => item.mediaType === 'movie'),
    tv: items.filter((item) => item.mediaType === 'tv'),
    people: items.filter((item) => item.mediaType === 'person'),
  }
}

export interface TrendingResponse {
  page: number
  results: TransformedTrendingItem[]
  totalPages: number
  totalResults: number
}

/**
 * Transforms a trending API response
 * 
 * @param response - Raw API response
 * @param limit - Optional limit on results
 * @returns Transformed response with paging info
 */
export function transformTrendingResponse(
  response: any,
  limit?: number
): TrendingResponse {
  const transformed = transformTrendingList(response.results || [])
  
  return {
    page: response.page || 1,
    results: limit ? transformed.slice(0, limit) : transformed,
    totalPages: response.total_pages || 0,
    totalResults: response.total_results || 0,
  }
}