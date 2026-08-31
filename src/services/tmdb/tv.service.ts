/**
 * TV Service
 * 
 * Service for fetching TV show data from TMDB API.
 * Provides methods for popular, airing today, on the air, and top rated TV shows.
 * Includes TV details, similar shows, and credits.
 */

import { apiClient } from '../api/client'
import { TMDB_ENDPOINTS } from '@/constants'
import type { TVShow, TVResponse, TVFilters, TVCreditsResponse, TVDetails } from '@/types/tv'

export class TVService {
  private readonly basePath = TMDB_ENDPOINTS.TV

  /**
   * Fetches popular TV shows
   * 
   * @param page - Page number for pagination
   * @returns TV response with results
   */
  async getPopular(page: number = 1): Promise<TVResponse> {
    return apiClient.get<TVResponse>(`${this.basePath}/popular`, { page })
  }

  /**
   * Fetches TV shows airing today
   * 
   * @param page - Page number for pagination
   * @returns TV response with results
   */
  async getAiringToday(page: number = 1): Promise<TVResponse> {
    return apiClient.get<TVResponse>(`${this.basePath}/airing_today`, { page })
  }

  /**
   * Fetches TV shows currently on the air
   * 
   * @param page - Page number for pagination
   * @returns TV response with results
   */
  async getOnTheAir(page: number = 1): Promise<TVResponse> {
    return apiClient.get<TVResponse>(`${this.basePath}/on_the_air`, { page })
  }

  /**
   * Fetches top rated TV shows
   * 
   * @param page - Page number for pagination
   * @returns TV response with results
   */
  async getTopRated(page: number = 1): Promise<TVResponse> {
    return apiClient.get<TVResponse>(`${this.basePath}/top_rated`, { page })
  }

  /**
   * Fetches detailed TV show information
   * 
   * @param id - TV show ID
   * @returns TV details
   */
  async getDetails(id: string | number): Promise<TVDetails> {
    return apiClient.get<TVDetails>(`${this.basePath}/${id}`)
  }

  /**
   * Fetches TV shows with discovery filters
   * 
   * @param filters - Discovery filter parameters
   * @returns TV response with results
   */
  async getDiscover(filters: TVFilters): Promise<TVResponse> {
    return apiClient.get<TVResponse>(`${TMDB_ENDPOINTS.DISCOVER}/tv`, filters)
  }

  /**
   * Fetches similar TV shows
   * 
   * @param id - TV show ID
   * @param page - Page number for pagination
   * @returns TV response with similar shows
   */
  async getSimilar(id: string | number, page: number = 1): Promise<TVResponse> {
    return apiClient.get<TVResponse>(`${this.basePath}/${id}/similar`, { page })
  }

  /**
   * Fetches TV show credits (cast and crew)
   * 
   * @param id - TV show ID
   * @returns TV credits response
   */
  async getCredits(id: string | number): Promise<TVCreditsResponse> {
    return apiClient.get<TVCreditsResponse>(`${this.basePath}/${id}/credits`)
  }

  /**
   * Builds a poster URL from the path
   * 
   * @param path - Poster path
   * @param size - Image size (small, medium, large)
   * @returns Full poster URL or null
   */
  getPosterUrl(path: string | null, size: 'small' | 'medium' | 'large' = 'medium'): string | null {
    if (!path) return null
    const sizes = {
      small: 'w185',
      medium: 'w342',
      large: 'w500',
    }
    return `https://image.tmdb.org/t/p/${sizes[size]}${path}`
  }
}

export const tvService = new TVService()