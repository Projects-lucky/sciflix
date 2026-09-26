/**
 * VideoContext
 * Global trailer modal state + per-item trailer key cache.
 *
 * Simple by design:
 * - One hook: useTrailer(id, mediaType) → { videoKey, isLoading }
 * - TanStack Query caches automatically — no manual cache, no batch, no prefetch
 * - Global modal state lives here
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { MediaType } from "@/db/schema";

// ============================================
// TYPES
// ============================================

interface VideosResponse {
  id: number;
  results: Array<{
    id: string;
    key: string;
    site: string;
    type: string;
    official: boolean;
  }>;
}

interface TrailerModalState {
  open: boolean;
  videoKey: string | null;
  title: string;
}

interface VideoContextValue {
  playTrailer: (videoKey: string, title: string) => void;
  closeTrailer: () => void;
  modalState: TrailerModalState;
}

const VideoContext = createContext<VideoContextValue | null>(null);

// ============================================
// FETCHER
// ============================================

async function fetchTrailerKey(
  tmdbId: number,
  mediaType: MediaType,
): Promise<string | null> {
  try {
    const res = await fetch(`/api/tmdb/${mediaType}/${tmdbId}/videos`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as VideosResponse;
    const videos = data.results ?? [];

    const trailer =
      videos.find(
        (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
      ) ||
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
      videos.find((v) => v.site === "YouTube");

    return trailer?.key ?? null;
  } catch {
    return null;
  }
}

// ============================================
// PROVIDER
// ============================================

export function VideoProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<TrailerModalState>({
    open: false,
    videoKey: null,
    title: "",
  });

  const playTrailer = useCallback((videoKey: string, title: string) => {
    setModalState({ open: true, videoKey, title });
  }, []);

  const closeTrailer = useCallback(() => {
    setModalState({ open: false, videoKey: null, title: "" });
  }, []);

  const value = useMemo<VideoContextValue>(
    () => ({ playTrailer, closeTrailer, modalState }),
    [playTrailer, closeTrailer, modalState],
  );

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
}

// ============================================
// HOOKS
// ============================================

function useVideoContext(): VideoContextValue {
  const ctx = useContext(VideoContext);
  if (!ctx) {
    throw new Error("useVideoContext must be used inside <VideoProvider>");
  }
  return ctx;
}

/**
 * Fetch + cache the trailer key for a movie/TV show.
 * Fetches once on mount. TanStack caches for 30 min.
 *
 * Usage:
 *   const { videoKey, isLoading } = useTrailer(movie.id, 'movie');
 */
export function useTrailer(tmdbId: number, mediaType: MediaType) {
  const query = useQuery({
    queryKey: ["trailer-key", mediaType, tmdbId],
    queryFn: () => fetchTrailerKey(tmdbId, mediaType),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 0,
  });

  return {
    videoKey: query.data ?? null,
    isLoading: query.isLoading,
  };
}

/**
 * Open the global trailer modal.
 */
export function usePlayTrailer() {
  return useVideoContext().playTrailer;
}

/**
 * Read modal state — used by <GlobalTrailer />.
 */
export function useTrailerModal() {
  const { modalState, closeTrailer } = useVideoContext();
  return { ...modalState, close: closeTrailer };
}
