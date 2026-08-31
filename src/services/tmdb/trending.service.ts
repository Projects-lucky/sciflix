/**
 * Trending Service
 * 
 * Service for fetching trending content from TMDB API.
 * Supports movies, TV shows, and people with day/week time windows.
 * Provides grouped trending data for dashboard displays.
 */

import { apiClient } from '../api/client'
import { TMDB_ENDPOINTS } from '@/constants'
import type { Movie } from '@/types/movie'
import type { TVShow } from '@/types/tv'
import type { Person } from '@/types/person'

export type TrendingTimeWindow = 'day' | 'week'
export type TrendingMediaType = 'all' | 'movie' | 'tv' | 'person'

export interface TrendingResponse {
  page: number
  results: Array<{
    id: number
    media_type: 'movie' | 'tv' | 'person'
    title?: string
    name?: string
    overview?: string
    poster_path?: string | null
    profile_path?: string | null
    backdrop_path?: string | null
    vote_average?: number
    vote_count?: number
    popularity: number
    release_date?: string
    first_air_date?: string
    known_for?: Person['known_for']
  }>
  total_pages: number
  total_results: number
}

export class TrendingService {
  /**
   * Fetches trending content across all media types
   * 
   * @param mediaType - Media type filter (all, movie, tv, person)
   * @param timeWindow - Time window (day or week)
   * @param page - Page number for pagination
   * @returns Trending response with results
   */
  async getTrending(
    mediaType: TrendingMediaType = 'all',
    timeWindow: TrendingTimeWindow = 'week',
    page: number = 1
  ): Promise<TrendingResponse> {
    return apiClient.get<TrendingResponse>(
      `${TMDB_ENDPOINTS.TRENDING}/${mediaType}/${timeWindow}`,
      { page }
    )
  }

  /**
   * Fetches trending movies
   * 
   * @param timeWindow - Time window (day or week)
   * @param page - Page number for pagination
   * @returns Trending movies response
   */
  async getTrendingMovies(timeWindow: TrendingTimeWindow = 'week', page: number = 1): Promise<{
    page: number
    results: Movie[]
    total_pages: number
    total_results: number
  }> {
    return apiClient.get(`${TMDB_ENDPOINTS.TRENDING}/movie/${timeWindow}`, { page })
  }

  /**
   * Fetches trending TV shows
   * 
   * @param timeWindow - Time window (day or week)
   * @param page - Page number for pagination
   * @returns Trending TV shows response
   */
  async getTrendingTV(timeWindow: TrendingTimeWindow = 'week', page: number = 1): Promise<{
    page: number
    results: TVShow[]
    total_pages: number
    total_results: number
  }> {
    return apiClient.get(`${TMDB_ENDPOINTS.TRENDING}/tv/${timeWindow}`, { page })
  }

  /**
   * Fetches trending people
   * 
   * @param timeWindow - Time window (day or week)
   * @param page - Page number for pagination
   * @returns Trending people response
   */
  async getTrendingPeople(timeWindow: TrendingTimeWindow = 'week', page: number = 1): Promise<{
    page: number
    results: Person[]
    total_pages: number
    total_results: number
  }> {
    return apiClient.get(`${TMDB_ENDPOINTS.TRENDING}/person/${timeWindow}`, { page })
  }

  /**
   * Fetches trending content grouped by media type
   * 
   * @param timeWindow - Time window (day or week)
   * @returns Grouped trending data with movies, TV, and people
   */
  async getTrendingGrouped(timeWindow: TrendingTimeWindow = 'week'): Promise<{
    movies: Movie[]
    tv: TVShow[]
    people: Person[]
  }> {
    const [movies, tv, people] = await Promise.all([
      this.getTrendingMovies(timeWindow),
      this.getTrendingTV(timeWindow),
      this.getTrendingPeople(timeWindow),
    ])

    return {
      movies: movies.results,
      tv: tv.results,
      people: people.results,
    }
  }
}

export const trendingService = new TrendingService()