/**
 * Movies Service
 * 
 * Service for fetching movie data from TMDB API.
 * Provides methods for popular, now playing, upcoming, top rated, and discover endpoints.
 * Includes movie details, similar movies, and credits.
 */

import { apiClient } from '../api/client'
import { TMDB_ENDPOINTS } from '@/constants'
import type { Movie, MovieDetails, MovieResponse, MovieFilters, MovieCreditsResponse } from '@/types/movie'

export class MoviesService {
  private readonly basePath = TMDB_ENDPOINTS.MOVIE

  /**
   * Fetches popular movies
   * 
   * @param page - Page number for pagination
   * @returns Movie response with results
   */
  async getPopular(page: number = 1): Promise<MovieResponse> {
    return apiClient.get<MovieResponse>(`${this.basePath}/popular`, { page })
  }

  /**
   * Fetches currently playing movies
   * 
   * @param page - Page number for pagination
   * @returns Movie response with results
   */
  async getNowPlaying(page: number = 1): Promise<MovieResponse> {
    return apiClient.get<MovieResponse>(`${this.basePath}/now_playing`, { page })
  }

  /**
   * Fetches upcoming movies
   * 
   * @param page - Page number for pagination
   * @returns Movie response with results
   */
  async getUpcoming(page: number = 1): Promise<MovieResponse> {
    return apiClient.get<MovieResponse>(`${this.basePath}/upcoming`, { page })
  }

  /**
   * Fetches top rated movies
   * 
   * @param page - Page number for pagination
   * @returns Movie response with results
   */
  async getTopRated(page: number = 1): Promise<MovieResponse> {
    return apiClient.get<MovieResponse>(`${this.basePath}/top_rated`, { page })
  }

  /**
   * Fetches detailed movie information
   * 
   * @param id - Movie ID
   * @returns Movie details
   */
  async getDetails(id: string | number): Promise<MovieDetails> {
    return apiClient.get<MovieDetails>(`${this.basePath}/${id}`)
  }

  /**
   * Fetches movies with discovery filters
   * 
   * @param filters - Discovery filter parameters
   * @returns Movie response with results
   */
  async getDiscover(filters: MovieFilters): Promise<MovieResponse> {
    return apiClient.get<MovieResponse>(`${TMDB_ENDPOINTS.DISCOVER}/movie`, filters)
  }

  /**
   * Fetches similar movies
   * 
   * @param id - Movie ID
   * @param page - Page number for pagination
   * @returns Movie response with similar movies
   */
  async getSimilar(id: string | number, page: number = 1): Promise<MovieResponse> {
    return apiClient.get<MovieResponse>(`${this.basePath}/${id}/similar`, { page })
  }

  /**
   * Fetches movie credits (cast and crew)
   * 
   * @param id - Movie ID
   * @returns Movie credits response
   */
  async getCredits(id: string | number): Promise<MovieCreditsResponse> {
    return apiClient.get<MovieCreditsResponse>(`${this.basePath}/${id}/credits`)
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
    return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/t/p/${sizes[size]}${path}`
  }
}

export const moviesService = new MoviesService()