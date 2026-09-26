/**
 * MovieCard Component
 * Truly fluid — fills whatever size its parent gives it.
 *
 * The card:
 * - Uses `w-full h-full` to consume parent dimensions
 * - Poster section uses `flex-1` to fill remaining vertical space
 * - No fixed aspect ratio — you set the shape from the container
 *
 * Usage patterns:
 *
 *   // Fixed dimensions on the card
 *   <MovieCard item={movie} className="w-40 h-64" />
 *
 *   // Grid with fixed row height
 *   <div className="grid grid-cols-5 auto-rows-[300px] gap-4">
 *     <MovieCard item={movie} />
 *   </div>
 *
 *   // Parent controls aspect ratio
 *   <div className="aspect-[2/3]">
 *     <MovieCard item={movie} />
 *   </div>
 */

"use client";

import { Play, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WatchlistButton } from "@/components/watchlist/watchlist-button";
import { TMDB_CONFIG } from "@/lib/config/app.config";
import { getGenreNameById } from "@/lib/services/tmdb/routes/genres";
import { cn } from "@/lib/utils";
import { usePlayTrailer, useTrailer } from "@/lib/video/context";
import type { TMDBMovie } from "@/types/movie.types";
import type { TMDBTV } from "@/types/tv.types";

// ============================================
// TYPES
// ============================================

export type MovieCardItem = TMDBMovie | TMDBTV;
export type MovieCardVariant = "default" | "compact" | "hero";

export interface MovieCardProps {
  item: MovieCardItem;
  variant?: MovieCardVariant;
  showGenre?: boolean;
  showWatchlistButton?: boolean;
  className?: string;
  priority?: boolean;
}

// ============================================
// HELPERS
// ============================================

function getTitle(item: MovieCardItem): string {
  if ("title" in item) return item.title;
  if ("name" in item) return item.name;
  return "Unknown";
}

function getReleaseYear(item: MovieCardItem): string | null {
  if ("release_date" in item && item.release_date) {
    return item.release_date.split("-")[0];
  }
  if ("first_air_date" in item && item.first_air_date) {
    return item.first_air_date.split("-")[0];
  }
  return null;
}

function getPosterPath(item: MovieCardItem): string | null {
  return item.poster_path || null;
}

function getBackdropPath(item: MovieCardItem): string | null {
  if ("backdrop_path" in item) return item.backdrop_path || null;
  return null;
}

function getRating(item: MovieCardItem): number | null {
  return item.vote_average || null;
}

function getMediaType(item: MovieCardItem): "movie" | "tv" {
  if ("media_type" in item) {
    const mt = (item as { media_type?: string }).media_type;
    if (mt === "movie" || mt === "tv") return mt;
  }
  if ("title" in item) return "movie";
  if ("name" in item) return "tv";
  return "movie";
}

function getGenreNames(item: MovieCardItem): string[] {
  if (!("genre_ids" in item) || !item.genre_ids) return [];
  return item.genre_ids.slice(0, 2).map((id) => getGenreNameById(id));
}

function getDetailUrl(item: MovieCardItem): string {
  const mediaType = getMediaType(item);
  return mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
}

// ============================================
// VARIANT CONFIG (typography only)
// ============================================

const VARIANTS: Record<
  MovieCardVariant,
  {
    imageSize: string;
    titleSize: string;
    ratingSize: string;
    yearSize: string;
    gap: string;
  }
> = {
  default: {
    imageSize: "w342",
    titleSize: "text-md",
    ratingSize: "text-xs",
    yearSize: "text-xs",
    gap: "gap-1.5",
  },
  compact: {
    imageSize: "w185",
    titleSize: "text-xs",
    ratingSize: "text-[10px]",
    yearSize: "text-[10px]",
    gap: "gap-1",
  },
  hero: {
    imageSize: "w342",
    titleSize: "text-base font-semibold",
    ratingSize: "text-sm",
    yearSize: "text-sm",
    gap: "gap-2",
  },
};

// ============================================
// COMPONENT
// ============================================

export function MovieCard({
  item,
  variant = "default",
  showGenre = true,
  showWatchlistButton = true,
  className,
  priority = false,
}: MovieCardProps) {
  const mediaType = getMediaType(item);

  const { videoKey } = useTrailer(item.id, mediaType);
  const playTrailer = usePlayTrailer();

  const title = getTitle(item);
  const year = getReleaseYear(item);
  const posterPath = getPosterPath(item);
  const backdropPath = getBackdropPath(item);
  const rating = getRating(item);
  const genreNames = getGenreNames(item);
  const detailUrl = getDetailUrl(item);

  const v = VARIANTS[variant];
  const imageUrl = posterPath
    ? `${TMDB_CONFIG.image.baseUrl}/${v.imageSize}${posterPath}`
    : null;

  const backdropImageUrl =
    backdropPath && variant === "hero"
      ? `${TMDB_CONFIG.image.baseUrl}/w780${backdropPath}`
      : null;

  const ratingColor = rating
    ? rating >= 7
      ? "text-green-400"
      : rating >= 5
        ? "text-yellow-400"
        : "text-red-400"
    : "text-gray-400";

  const hasTrailer = Boolean(videoKey);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoKey) playTrailer(videoKey, `${title} — Trailer`);
  };

  return (
    <div
      className={cn(
        // Fluid: fills parent width AND height
        "group relative flex flex-col w-full h-full",
        "transition-all duration-200 hover:scale-[1.02] hover:z-10",
        "p-2",
        v.gap,
        className,
      )}
    >
      {/*
        Poster container:
        - `flex-1` → takes all vertical space not used by the info section
        - `relative` → anchors absolutely positioned children
        - `min-h-0` → allows flex-1 to shrink below content size
      */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden rounded-lg bg-gray-800">
        <Link
          href={detailUrl}
          prefetch={false}
          className="absolute inset-0 z-0"
          aria-label={title}
        >
          {backdropImageUrl && variant === "hero" ? (
            <Image
              src={backdropImageUrl}
              alt={title}
              fill
              className="object-cover"
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              loading="eager"
              unoptimized
            />
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-700 text-gray-400 text-center p-2">
              <span className="text-2xl font-logo">sciflix</span>
            </div>
          )}

          {rating !== null && (
            <div
              className={cn(
                "absolute top-1.5 left-1.5 flex items-center gap-0.5",
                "px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm",
                "font-medium",
                ratingColor,
                v.ratingSize,
              )}
            >
              <Star className="size-3" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}

          {(mediaType === "tv" || mediaType === "movie") && (
            <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-orange-700 text-white text-[10px] font-medium uppercase">
              {mediaType}
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
        </Link>

        {hasTrailer && (
          <button
            type="button"
            onClick={handlePlayClick}
            aria-label={`Play trailer for ${title}`}
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
              "flex items-center justify-center",
              "w-12 h-12 rounded-full",
              "bg-white text-orange-700 shadow-xl",
              "transition-all duration-150",
              "hover:scale-110",
              "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
              "cursor-pointer",
            )}
          >
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </button>
        )}

        {showWatchlistButton && (
          <span
            className={cn(
              "absolute top-1.5 right-1.5 z-30",
              "transition-opacity duration-200",
              "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100",
            )}
          >
            <WatchlistButton
              tmdbId={item.id}
              mediaType={mediaType}
              title={title}
              posterPath={posterPath}
              releaseYear={year}
              variant="icon"
              className="h-8 w-8 shadow-lg border border-amber-600 bg-white"
              iconClassName="text-amber-700"
            />
          </span>
        )}
      </div>

      {/* Info section — shrinks to fit its content, doesn't grow */}
      <Link href={detailUrl} prefetch={false} className="shrink-0">
        <div className="flex flex-col min-w-0 space-y-1.5">
          <h3
            className={cn(
              "font-light font-poppins truncate line-clamp-1",
              v.titleSize,
            )}
            title={title}
          >
            {title}
          </h3>

          <div className="flex items-center gap-2 text-gray-400 font-extralight font-poppins">
            {year && <span className={v.yearSize}>{year}</span>}
            {showGenre && genreNames.length > 0 && (
              <span className={cn("truncate", v.yearSize)}>
                {genreNames.join(" • ")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
