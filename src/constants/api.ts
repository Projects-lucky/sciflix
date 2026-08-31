/**
 * TMDB API Configuration
 * 
 * Centralized configuration for TMDB API endpoints, image URLs, and HTTP settings.
 * Used across the application for consistent API consumption.
 */

export const TMDB_CONFIG = {
  BASE_URL: '/api/xyz',
  API_KEY: process.env.TMDB_ACCESS_TOKEN!,
  READ_ACCESS_TOKEN: process.env.TMDB_API_READ_ACCESS_TOKEN!,
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
  IMAGE_SIZES: {
    poster: {
      small: 'w185',
      medium: 'w342',
      large: 'w500',
      original: 'original',
    },
    backdrop: {
      small: 'w300',
      medium: 'w780',
      large: 'w1280',
      original: 'original',
    },
    profile: {
      small: 'w45',
      medium: 'w185',
      large: 'h632',
      original: 'original',
    },
  },
} as const

export const TMDB_ENDPOINTS = {
  MOVIE: '/movie',
  TV: '/tv',
  SEARCH: '/search',
  PERSON: '/person',
  DISCOVER: '/discover',
  TRENDING: '/trending',
  GENRE: '/genre',
} as const

export const HTTP_CONFIG = {
  retries: 6,
  timeout: 8000,
  baseDelay: 1500,
}