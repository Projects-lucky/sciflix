/**
 * Watchlist Database Queries
 * Pure DB operations — no auth, no revalidation.
 *
 * All functions take userId as an argument. Auth logic lives in
 * Server Actions (src/app/actions/watchlist.ts).
 */

import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './index';
import {
  watchlistItems,
  type WatchlistItem,
  type NewWatchlistItem,
  type WatchlistStatus,
  type MediaType,
} from './schema';

// ============================================
// READ
// ============================================

/**
 * Get all watchlist items for a user, newest first
 */
export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  return db
    .select()
    .from(watchlistItems)
    .where(eq(watchlistItems.userId, userId))
    .orderBy(desc(watchlistItems.addedAt));
}

/**
 * Get watchlist items filtered by status
 */
export async function getWatchlistByStatus(
  userId: string,
  status: WatchlistStatus
): Promise<WatchlistItem[]> {
  return db
    .select()
    .from(watchlistItems)
    .where(
      and(
        eq(watchlistItems.userId, userId),
        eq(watchlistItems.status, status)
      )
    )
    .orderBy(desc(watchlistItems.addedAt));
}

/**
 * Get a single watchlist item by (user, tmdb_id, media_type)
 * Returns null if not found
 */
export async function getWatchlistItem(
  userId: string,
  tmdbId: number,
  mediaType: MediaType
): Promise<WatchlistItem | null> {
  const rows = await db
    .select()
    .from(watchlistItems)
    .where(
      and(
        eq(watchlistItems.userId, userId),
        eq(watchlistItems.tmdbId, tmdbId),
        eq(watchlistItems.mediaType, mediaType)
      )
    )
    .limit(1);

  return rows[0] ?? null;
}

/**
 * Check if an item is in the user's watchlist.
 * Cheaper than getWatchlistItem — returns boolean.
 */
export async function isInWatchlist(
  userId: string,
  tmdbId: number,
  mediaType: MediaType
): Promise<boolean> {
  const rows = await db
    .select({ id: watchlistItems.id })
    .from(watchlistItems)
    .where(
      and(
        eq(watchlistItems.userId, userId),
        eq(watchlistItems.tmdbId, tmdbId),
        eq(watchlistItems.mediaType, mediaType)
      )
    )
    .limit(1);

  return rows.length > 0;
}

/**
 * Count of watchlist items for a user
 */
export async function getWatchlistCount(userId: string): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(watchlistItems)
    .where(eq(watchlistItems.userId, userId));

  return rows[0]?.count ?? 0;
}

// ============================================
// WRITE
// ============================================

/**
 * Add an item to the watchlist.
 * Uses ON CONFLICT DO NOTHING — adding the same item twice is safe.
 *
 * Returns the created (or existing) item, or null if something went wrong.
 */
export async function addToWatchlist(
  data: NewWatchlistItem
): Promise<WatchlistItem | null> {
  const inserted = await db
    .insert(watchlistItems)
    .values(data)
    .onConflictDoNothing({
      target: [
        watchlistItems.userId,
        watchlistItems.tmdbId,
        watchlistItems.mediaType,
      ],
    })
    .returning();

  // If insert was a no-op (conflict), fetch the existing row
  if (inserted.length === 0) {
    return getWatchlistItem(data.userId, data.tmdbId, data.mediaType);
  }

  return inserted[0];
}

/**
 * Remove an item from the watchlist.
 * Returns true if a row was deleted, false if nothing matched.
 */
export async function removeFromWatchlist(
  userId: string,
  tmdbId: number,
  mediaType: MediaType
): Promise<boolean> {
  const deleted = await db
    .delete(watchlistItems)
    .where(
      and(
        eq(watchlistItems.userId, userId),
        eq(watchlistItems.tmdbId, tmdbId),
        eq(watchlistItems.mediaType, mediaType)
      )
    )
    .returning({ id: watchlistItems.id });

  return deleted.length > 0;
}

/**
 * Toggle watchlist status: want_to_watch ↔ watched.
 * Sets watchedAt timestamp when moving to 'watched', clears it when moving back.
 *
 * Returns the updated item, or null if not found / not owned by user.
 */
export async function updateWatchlistStatus(
  id: string,
  userId: string,
  status: WatchlistStatus
): Promise<WatchlistItem | null> {
  const updated = await db
    .update(watchlistItems)
    .set({
      status,
      watchedAt: status === 'watched' ? new Date() : null,
    })
    .where(
      and(
        eq(watchlistItems.id, id),
        eq(watchlistItems.userId, userId) // ensure user owns the row
      )
    )
    .returning();

  return updated[0] ?? null;
}

/**
 * Clear the entire watchlist for a user.
 * Returns the number of deleted rows.
 */
export async function clearWatchlist(userId: string): Promise<number> {
  const deleted = await db
    .delete(watchlistItems)
    .where(eq(watchlistItems.userId, userId))
    .returning({ id: watchlistItems.id });

  return deleted.length;
}