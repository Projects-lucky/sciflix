/**
 * Movie Transformers
 * 
 * Transforms raw TMDB movie data into UI-friendly formats.
 * Handles list items, details pages, and similar movies.
 * Uses common formatting utilities for consistent output.
 */

import type { Movie, MovieDetails } from '@/types/movie'
import {
  formatDate,
  extractYear,
  formatRuntime,
  formatCurrency,
  buildImageUrl,
  getYearFromDate,
  truncateText,
} from './common'

// Transformed Movie Interface (UI-friendly)
export interface TransformedMovie {
  // Core
  id: number
  title: string
  originalTitle: string
  
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
  releaseDate: string
  releaseYear: string
  
  // Runtime
  runtime: string // Formatted: "2h 30m"
  runtimeMinutes: number | null
  
  // Financials
  budget: string
  revenue: string
  
  // Genres
  genres: Array<{ id: number; name: string }>
  
  // Status
  status: string
  
  // Production
  productionCompanies: Array<{ id: number; name: string; logo: string | null }>
  productionCountries: Array<{ iso: string; name: string }>
  
  // Links
  homepage: string | null
  imdbId: string | null
  
  // Raw data for further processing
  raw: MovieDetails
}

/**
 * Transforms a movie list item for grid displays
 * 
 * @param movie - Raw movie object
 * @returns Simplified movie item with poster and year
 */
export function transformMovieListItem(movie: Movie): {
  id: number
  title: string
  poster: string | null
  rating: number
  year: string
} {
  return {
    id: movie.id,
    title: movie.title,
    poster: buildImageUrl(movie.poster_path, 'w342'),
    rating: movie.vote_average,
    year: getYearFromDate(movie.release_date),
  }
}

/**
 * Transforms movie details for the detail page
 * 
 * @param movie - Raw movie details
 * @returns UI-friendly transformed movie object
 */
export function transformMovieDetails(movie: MovieDetails): TransformedMovie {
  return {
    // Core
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,

    // Images
    posterUrl: buildImageUrl(movie.poster_path, 'w500'),
    backdropUrl: buildImageUrl(movie.backdrop_path, 'w1280'),

    // Details
    overview: movie.overview || 'No overview available.',
    shortOverview: truncateText(movie.overview, 160),
    tagline: movie.tagline || null,

    // Stats
    rating: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,

    // Dates
    releaseDate: formatDate(movie.release_date),
    releaseYear: extractYear(movie.release_date),

    // Runtime
    runtime: formatRuntime(movie.runtime),
    runtimeMinutes: movie.runtime,

    // Financials
    budget: formatCurrency(movie.budget),
    revenue: formatCurrency(movie.revenue),

    // Genres
    genres: movie.genres || [],

    // Status
    status: movie.status,

    // Production
    productionCompanies: (movie.production_companies || []).map((company) => ({
      id: company.id,
      name: company.name,
      logo: buildImageUrl(company.logo_path, 'w92'),
    })),
    productionCountries: (movie.production_countries || []).map((country) => ({
      iso: country.iso_3166_1,
      name: country.name,
    })),

    // Links
    homepage: movie.homepage || null,
    imdbId: movie.imdb_id || null,

    // Raw
    raw: movie,
  }
}

/**
 * Transforms a movie for similar movies display
 * 
 * @param movie - Raw movie object
 * @returns Simplified movie item for similar section
 */
export function transformSimilarMovie(movie: Movie): {
  id: number
  title: string
  poster: string | null
  rating: number
  year: string
} {
  return {
    id: movie.id,
    title: movie.title,
    poster: buildImageUrl(movie.poster_path, 'w342'),
    rating: movie.vote_average,
    year: getYearFromDate(movie.release_date),
  }
}