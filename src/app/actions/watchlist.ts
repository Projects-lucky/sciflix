/**
 * Watchlist Server Actions
 * Client-callable functions that:
 * 1. Verify the user is signed in via Clerk
 * 2. Delegate to pure DB queries in src/db/queries.ts
 * 3. Revalidate affected pages
 *
 * All exports are 'use server' — called from client components
 * via form actions or direct invocation.
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  addToWatchlist,
  getWatchlist,
  isInWatchlist,
  removeFromWatchlist,
  updateWatchlistStatus,
} from "@/db/queries";
import type { MediaType, WatchlistItem, WatchlistStatus } from "@/db/schema";

// ============================================
// TYPES
// ============================================

export interface AddToWatchlistInput {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath?: string | null;
  releaseYear?: string | null;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// HELPERS
// ============================================

/**
 * Get the current user ID or throw.
 * All watchlist actions require authentication.
 */
async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

/**
 * Revalidate all paths affected by watchlist changes
 */
function revalidateWatchlistPaths() {
  revalidatePath("/watchlist");
  revalidatePath("/movie", "layout");
  revalidatePath("/tv", "layout");
}

// ============================================
// ACTIONS
// ============================================

/**
 * Add an item to the current user's watchlist.
 * Idempotent — adding the same item twice is safe.
 */
export async function addToWatchlistAction(
  input: AddToWatchlistInput,
): Promise<ActionResult<WatchlistItem>> {
  try {
    const userId = await requireUserId();

    const item = await addToWatchlist({
      userId,
      tmdbId: input.tmdbId,
      mediaType: input.mediaType,
      title: input.title,
      posterPath: input.posterPath ?? null,
      releaseYear: input.releaseYear ?? null,
      status: "want_to_watch",
    });

    if (!item) {
      return { success: false, error: "Failed to add to watchlist" };
    }

    revalidateWatchlistPaths();
    return { success: true, data: item };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[addToWatchlistAction]", message);
    return { success: false, error: message };
  }
}

/**
 * Remove an item from the current user's watchlist.
 */
export async function removeFromWatchlistAction(
  tmdbId: number,
  mediaType: MediaType,
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();

    const removed = await removeFromWatchlist(userId, tmdbId, mediaType);

    if (!removed) {
      return { success: false, error: "Item not in watchlist" };
    }

    revalidateWatchlistPaths();
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[removeFromWatchlistAction]", message);
    return { success: false, error: message };
  }
}

/**
 * Toggle an item's status between want_to_watch and watched.
 * Verifies ownership — users can only modify their own items.
 */
export async function toggleWatchlistStatusAction(
  id: string,
  newStatus: WatchlistStatus,
): Promise<ActionResult<WatchlistItem>> {
  try {
    const userId = await requireUserId();

    const updated = await updateWatchlistStatus(id, userId, newStatus);

    if (!updated) {
      return { success: false, error: "Item not found or access denied" };
    }

    revalidateWatchlistPaths();
    return { success: true, data: updated };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[toggleWatchlistStatusAction]", message);
    return { success: false, error: message };
  }
}

/**
 * Fetch the current user's watchlist.
 * Used for server-side rendering of /watchlist page.
 */
export async function getWatchlistAction(): Promise<WatchlistItem[]> {
  try {
    const userId = await requireUserId();
    return getWatchlist(userId);
  } catch (err) {
    console.error("[getWatchlistAction]", err);
    return [];
  }
}

/**
 * Check if an item is in the current user's watchlist.
 * Returns false (not error) when user is not signed in.
 */
export async function isInWatchlistAction(
  tmdbId: number,
  mediaType: MediaType,
): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    return isInWatchlist(userId, tmdbId, mediaType);
  } catch (err) {
    console.error("[isInWatchlistAction]", err);
    return false;
  }
}
