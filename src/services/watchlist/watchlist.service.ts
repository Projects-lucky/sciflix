/**
 * Watchlist Service
 * 
 * Service for managing user watchlist items via internal API.
 * Handles GET, POST, and DELETE operations with data normalization.
 * Converts database formats to client-safe formats for consistency.
 */

import { internalApiClient } from '../api/internal.client';
import type { WatchlistItem } from '@/types/watchlist';

export class WatchlistService {
  /**
   * Fetches all watchlist items for the current user
   * 
   * @returns Array of normalized watchlist items
   */
  async getItems(): Promise<WatchlistItem[]> {
    const data = await internalApiClient.get<any[]>('/watchlist');
    
    return data.map((item) => ({
      ...item,
      // Normalize 'MOVIE' -> 'movie' for consistent type matching
      mediaType: item.mediaType?.toLowerCase() as 'movie' | 'tv',
      // Convert database numeric strings to numbers
      rating: item.rating ? parseFloat(item.rating) : 0,
    }));
  }

  /**
   * Adds a new item to the watchlist
   * 
   * @param mediaId - TMDB media identifier
   * @param mediaType - Media type (movie or tv)
   * @param title - Media title
   * @param poster - Poster image path
   * @param rating - User rating
   * @param year - Release year
   * @returns Normalized watchlist item
   */
  async addItem(
    mediaId: number,
    mediaType: 'movie' | 'tv',
    title: string,
    poster?: string | null,
    rating?: number,
    year?: string
  ): Promise<WatchlistItem> {
    const savedItem = await internalApiClient.post<any>('/watchlist', {
      mediaId,
      mediaType,
      title,
      poster,
      rating,
      year,
    });

    // Normalize response for client-side cache
    return {
      ...savedItem,
      mediaId: savedItem.mediaId,
      mediaType: savedItem.mediaType?.toLowerCase() as 'movie' | 'tv',
      rating: savedItem.rating ? parseFloat(savedItem.rating) : 0,
      year: savedItem.year || 'N/A',
    };
  }

  /**
   * Removes an item from the watchlist
   * 
   * @param mediaId - TMDB media identifier
   * @param mediaType - Media type (movie or tv)
   * @returns Promise that resolves when deletion is complete
   */
  async removeItem(mediaId: number, mediaType: 'movie' | 'tv'): Promise<void> {
    return internalApiClient.delete(`/watchlist?mediaId=${mediaId}&mediaType=${mediaType}`);
  }
}

export const watchlistService = new WatchlistService();