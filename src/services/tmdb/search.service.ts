/**
 * Search Service
 * 
 * Service for searching movies, TV shows, and people from TMDB API.
 * Provides multi-search and type-specific search methods.
 * Includes pagination, adult content filtering, and language support.
 */

import { apiClient } from '../api/client'
import { TMDB_ENDPOINTS } from '@/constants'

export interface SearchResponse {
  page: number
  results: Array<{
    id: number
    media_type: 'movie' | 'tv' | 'person'
    title?: string
    name?: string
    poster_path?: string | null
    profile_path?: string | null
    overview?: string
    release_date?: string
    first_air_date?: string
    vote_average?: number
  }>
  total_pages: number
  total_results: number
}

export interface ExtraSearchOptions {
  page?: number
  language?: string
  include_adult?: boolean
  year?: string
  primary_release_year?: string
  first_air_date_year?: string
}

export class SearchService {
  /**
   * Searches across all media types (movies, TV, people)
   * 
   * @param query - Search query string
   * @param page - Page number for pagination
   * @param includeAdult - Whether to include adult content
   * @param options - Additional search options
   * @returns Search response with results
   */
  async searchMulti(
    query: string,
    page: number = 1,
    includeAdult: boolean = false,
    options?: ExtraSearchOptions
  ): Promise<SearchResponse> {
    if (!query.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 }
    }

    return apiClient.get<SearchResponse>(`${TMDB_ENDPOINTS.SEARCH}/multi`, {
      query: query.trim(),
      page,
      include_adult: includeAdult,
      ...(options?.language && { language: options.language }),
    })
  }

  /**
   * Searches for movies
   * 
   * @param query - Search query string
   * @param page - Page number for pagination
   * @param options - Additional search options
   * @returns Search response with movie results
   */
  async searchMovies(
    query: string, 
    page: number = 1, 
    options?: ExtraSearchOptions
  ): Promise<SearchResponse> {
    return apiClient.get<SearchResponse>(`${TMDB_ENDPOINTS.SEARCH}/movie`, {
      query,
      page,
      ...options,
    })
  }

  /**
   * Searches for TV shows
   * 
   * @param query - Search query string
   * @param page - Page number for pagination
   * @param options - Additional search options
   * @returns Search response with TV results
   */
  async searchTV(
    query: string, 
    page: number = 1, 
    options?: ExtraSearchOptions
  ): Promise<SearchResponse> {
    return apiClient.get<SearchResponse>(`${TMDB_ENDPOINTS.SEARCH}/tv`, {
      query,
      page,
      ...options,
    })
  }

  /**
   * Searches for people
   * 
   * @param query - Search query string
   * @param page - Page number for pagination
   * @param options - Additional search options
   * @returns Search response with person results
   */
  async searchPerson(
    query: string, 
    page: number = 1, 
    options?: ExtraSearchOptions
  ): Promise<SearchResponse> {
    return apiClient.get<SearchResponse>(`${TMDB_ENDPOINTS.SEARCH}/person`, {
      query,
      page,
      ...(options?.language && { language: options.language }),
    })
  }
}

export const searchService = new SearchService()