/**
 * Genres Service
 * 
 * Service for fetching and caching movie and TV show genres from TMDB.
 * Provides helper methods for genre name lookups and ID resolution.
 * Caches results to reduce API calls.
 */

import { apiClient } from '../api/client'
import { TMDB_ENDPOINTS } from '@/constants'
import type { Genre, GenresResponse } from '@/types/genre'

export class GenresService {
  private movieCache: Genre[] | null = null
  private tvCache: Genre[] | null = null

  /**
   * Fetches movie genres from TMDB
   * 
   * @returns Array of movie genres
   */
  async getMovieGenres(): Promise<Genre[]> {
    if (this.movieCache) {
      return this.movieCache
    }

    const response = await apiClient.get<GenresResponse>(
      `${TMDB_ENDPOINTS.GENRE}/movie/list`
    )
    
    this.movieCache = response.genres
    return response.genres
  }

  /**
   * Fetches TV show genres from TMDB
   * 
   * @returns Array of TV genres
   */
  async getTVGenres(): Promise<Genre[]> {
    if (this.tvCache) {
      return this.tvCache
    }

    const response = await apiClient.get<GenresResponse>(
      `${TMDB_ENDPOINTS.GENRE}/tv/list`
    )
    
    this.tvCache = response.genres
    return response.genres
  }

  /**
   * Gets genre name by ID
   * 
   * @param id - Genre ID
   * @param type - Media type (movie or tv)
   * @returns Genre name or null if not found
   */
  async getGenreName(id: number, type: 'movie' | 'tv'): Promise<string | null> {
    const genres = type === 'movie' ? await this.getMovieGenres() : await this.getTVGenres()
    const genre = genres.find(g => g.id === id)
    return genre?.name || null
  }

  /**
   * Gets genre IDs from genre names
   * 
   * @param names - Array of genre names
   * @param type - Media type (movie or tv)
   * @returns Array of genre IDs
   */
  async getGenreIds(names: string[], type: 'movie' | 'tv'): Promise<number[]> {
    const genres = type === 'movie' ? await this.getMovieGenres() : await this.getTVGenres()
    return names
      .map(name => genres.find(g => g.name.toLowerCase() === name.toLowerCase()))
      .filter((g): g is Genre => g !== undefined)
      .map(g => g.id)
  }

  /**
   * Clears both movie and TV genre caches
   */
  clearCache(): void {
    this.movieCache = null
    this.tvCache = null
  }
}

export const genresService = new GenresService()