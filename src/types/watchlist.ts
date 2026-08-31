/**
 * Watchlist Types
 * 
 * Type definitions for user watchlist items.
 * Used across the application for watchlist management.
 */

export interface WatchlistItem {
  id: string
  userId: string
  mediaId: number
  mediaType: 'movie' | 'tv'
  title: string
  poster: string | null
  rating: number | null
  year: string | null
  addedAt: string
}