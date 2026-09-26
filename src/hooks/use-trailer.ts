/**
 * useTrailersBatch
 * Fetches trailer keys for many movies/TV shows in one batch.
 *
 * - Single TanStack Query per page of cards
 * - Parallel fetches inside queryFn
 * - Individual cards read from the cache synchronously — zero-latency hover
 * - Cached for 30 minutes
 */

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { MediaType } from "@/db/schema";

// ============================================
// TYPES
// ============================================

interface VideoResult {
  id: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
}

interface VideosResponse {
  id: number;
  results: VideoResult[];
}

export interface TrailerKeyMap {
  [key: string]: string | null; // "movie:550" → "BdJKm16Co6M"
}

// ============================================
// UTILS
// ============================================

function makeCacheKey(tmdbId: number, mediaType: MediaType): string {
  return `${mediaType}:${tmdbId}`;
}

function pickTrailerKey(videos: VideoResult[]): string | null {
  const trailer =
    videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
    ) ||
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.find((v) => v.site === "YouTube");
  return trailer?.key ?? null;
}

async function fetchOne(
  tmdbId: number,
  mediaType: MediaType,
): Promise<[string, string | null]> {
  try {
    const res = await fetch(`/api/tmdb/${mediaType}/${tmdbId}/videos`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [makeCacheKey(tmdbId, mediaType), null];

    const data = (await res.json()) as VideosResponse;
    return [
      makeCacheKey(tmdbId, mediaType),
      pickTrailerKey(data.results ?? []),
    ];
  } catch {
    return [makeCacheKey(tmdbId, mediaType), null];
  }
}

// ============================================
// HOOK
// ============================================

interface UseTrailersBatchInput {
  tmdbId: number;
  mediaType: MediaType;
}

/**
 * Fetches trailers for a set of items in one batch.
 * Returns a synchronous lookup function for instant access.
 *
 * Usage:
 *   const { getTrailerKey } = useTrailersBatch(items);
 *   const key = getTrailerKey(movie.id, 'movie'); // instant, from cache
 */
export function useTrailersBatch(items: UseTrailersBatchInput[]) {
  const queryClient = useQueryClient();

  // Stable identity for the query key
  const idsKey = items
    .map((i) => makeCacheKey(i.tmdbId, i.mediaType))
    .sort()
    .join(",");

  const query = useQuery({
    queryKey: ["trailers-batch", idsKey],
    queryFn: async (): Promise<TrailerKeyMap> => {
      // Fetch all in parallel
      const results = await Promise.all(
        items.map((i) => fetchOne(i.tmdbId, i.mediaType)),
      );

      // Build the map
      const map: TrailerKeyMap = {};
      for (const [key, value] of results) {
        map[key] = value;
      }
      return map;
    },
    enabled: items.length > 0,
    staleTime: 30 * 60 * 1000, // 30 min
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 0,
    // Serve previous data instantly while new batch loads
    placeholderData: (prev) => prev,
  });

  // Synchronous lookup — reads from query data OR from individual cache entries
  const getTrailerKey = (
    tmdbId: number,
    mediaType: MediaType,
  ): string | null => {
    const key = makeCacheKey(tmdbId, mediaType);

    // First try the batch result
    if (query.data && key in query.data) {
      return query.data[key];
    }

    // Fall back to any individual cached trailer query
    const individual = queryClient.getQueryData<{ trailerKey: string | null }>([
      "trailer",
      mediaType,
      tmdbId,
    ]);
    if (individual && "trailerKey" in individual) {
      return individual.trailerKey ?? null;
    }

    return null;
  };

  return {
    getTrailerKey,
    isLoading: query.isLoading,
    isReady: !query.isLoading,
  };
}
