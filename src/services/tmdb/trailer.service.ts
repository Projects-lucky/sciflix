/**
 * Trailer Service
 * 
 * Service for fetching video and trailer data from TMDB API.
 * Provides methods for getting all videos and filtering for trailers.
 * Prioritizes official trailers and teasers from YouTube.
 */

import { apiClient } from '../api/client'
import { TMDB_ENDPOINTS } from '@/constants/api'

export interface TrailerVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
}

export class TrailerService {
  /**
   * Fetches all videos for a specific movie or TV show
   * 
   * @param mediaType - Type of media (movie or tv)
   * @param id - Media ID
   * @returns Array of video objects
   */
  async getVideos(mediaType: 'movie' | 'tv', id: number): Promise<TrailerVideo[]> {
    const endpoint = mediaType === 'movie' 
      ? `${TMDB_ENDPOINTS.MOVIE}/${id}/videos`
      : `${TMDB_ENDPOINTS.TV}/${id}/videos`
    
    const response = await apiClient.get<{ results: TrailerVideo[] }>(endpoint)
    return response.results || []
  }

  /**
   * Fetches the best available trailer for a movie or TV show
   * Prioritizes official YouTube trailers, falls back to teasers.
   * 
   * @param mediaType - Type of media (movie or tv)
   * @param id - Media ID
   * @returns Trailer video or null if none found
   */
  async getTrailer(mediaType: 'movie' | 'tv', id: number): Promise<TrailerVideo | null> {
    const videos = await this.getVideos(mediaType, id)
    
    // Prioritize official trailers, then teasers
    const trailer = videos.find(
      (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    )
    
    return trailer || null
  }
}

export const trailerService = new TrailerService()