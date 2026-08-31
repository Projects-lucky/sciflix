/**
 * TV Transformers
 * 
 * Transforms raw TMDB TV show data into UI-friendly formats.
 * Handles list items, details pages, and similar shows.
 * Uses common formatting utilities for consistent output.
 */

import type { TVShow } from '@/types/tv'
import {
  formatDate,
  extractYear,
  buildImageUrl,
  getYearFromDate,
  truncateText,
} from './common'

// Transformed TV Interface
export interface TransformedTVShow {
  // Core
  id: number
  name: string
  originalName: string

  // Images
  posterUrl: string | null
  backdropUrl: string | null

  // Details
  overview: string
  shortOverview: string
  tagline: string | null

  // Stats
  rating: number
  voteCount: number
  popularity: number

  // Dates
  firstAirDate: string
  lastAirDate: string | null
  firstAirYear: string

  // Seasons
  numberOfSeasons: number
  numberOfEpisodes: number

  // Status
  status: string

  // Genres
  genres: Array<{ id: number; name: string }>

  // Creators
  createdBy: Array<{ id: number; name: string }>

  // Networks
  networks: Array<{ id: number; name: string; logo: string | null }>

  // Production
  productionCompanies: Array<{ id: number; name: string; logo: string | null }>

  // Links
  homepage: string | null

  // Raw
  raw: any
}

/**
 * Transforms a TV show list item for grid displays
 * 
 * @param show - Raw TV show object
 * @returns Simplified TV show item with poster and year
 */
export function transformTVListItem(show: TVShow): {
  id: number
  title: string
  poster: string | null
  rating: number
  year: string
} {
  return {
    id: show.id,
    title: show.name,
    poster: buildImageUrl(show.poster_path, 'w342'),
    rating: show.vote_average,
    year: getYearFromDate(show.first_air_date),
  }
}

/**
 * Transforms TV show details for the detail page
 * 
 * @param show - Raw TV show details
 * @returns UI-friendly transformed TV show object
 */
export function transformTVDetails(show: any): TransformedTVShow {
  return {
    // Core
    id: show.id,
    name: show.name,
    originalName: show.original_name,

    // Images
    posterUrl: buildImageUrl(show.poster_path, 'w500'),
    backdropUrl: buildImageUrl(show.backdrop_path, 'w1280'),

    // Details
    overview: show.overview || 'No overview available.',
    shortOverview: truncateText(show.overview, 160),
    tagline: show.tagline || null,

    // Stats
    rating: show.vote_average,
    voteCount: show.vote_count,
    popularity: show.popularity,

    // Dates
    firstAirDate: formatDate(show.first_air_date),
    lastAirDate: show.last_air_date ? formatDate(show.last_air_date) : null,
    firstAirYear: extractYear(show.first_air_date),

    // Seasons
    numberOfSeasons: show.number_of_seasons || 0,
    numberOfEpisodes: show.number_of_episodes || 0,

    // Status
    status: show.status,

    // Genres
    genres: show.genres || [],

    // Creators
    createdBy: (show.created_by || []).map((creator: any) => ({
      id: creator.id,
      name: creator.name,
    })),

    // Networks
    networks: (show.networks || []).map((network: any) => ({
      id: network.id,
      name: network.name,
      logo: buildImageUrl(network.logo_path, 'w92'),
    })),

    // Production
    productionCompanies: (show.production_companies || []).map((company: any) => ({
      id: company.id,
      name: company.name,
      logo: buildImageUrl(company.logo_path, 'w92'),
    })),

    // Links
    homepage: show.homepage || null,

    // Raw
    raw: show,
  }
}

/**
 * Transforms a TV show for similar shows display
 * 
 * @param show - Raw TV show object
 * @returns Simplified TV show item for similar section
 */
export function transformSimilarTV(show: TVShow): {
  id: number
  title: string
  poster: string | null
  rating: number
  year: string
} {
  return {
    id: show.id,
    title: show.name,
    poster: buildImageUrl(show.poster_path, 'w342'),
    rating: show.vote_average,
    year: getYearFromDate(show.first_air_date),
  }
}