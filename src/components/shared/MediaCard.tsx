/**
 * Media Card Component
 * 
 * Reusable card component for displaying movies, TV shows, and people.
 * Features hover effects, trailer playback, watchlist button, and rating badge.
 * Supports multiple media types with appropriate metadata display.
 */

"use client";
import { useState } from "react";
import { Play, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TMDB_CONFIG } from "@/constants/api";
import { UniversalMediaType } from "@/types/common";
import { getRatingColor } from "@/transformers";
import { useTrailer } from '@/hooks/useTrailer'
import { WatchlistButton } from "./WatchlistButton";

export interface NormalizedMediaItem {
  id: number;
  mediaType?: UniversalMediaType;
  title: string;
  image?: string | null;
  poster?: string | null;
  rating: number;
  year: string;
}

export type MediaCardProps = NormalizedMediaItem & { className?: string };

/**
 * MediaCard Component
 * 
 * @param id - Media identifier
 * @param mediaType - Type of media (movie, tv, person)
 * @param title - Media title
 * @param image - Poster image path
 * @param poster - Alternative poster path
 * @param rating - Vote average rating
 * @param year - Release year
 * @param className - Additional CSS classes
 * @returns Rendered media card
 */
export function MediaCard({
  id,
  mediaType,
  title,
  image,
  poster,
  rating,
  year,
  className,
}: MediaCardProps) {
  const { handlePlayTrailer, isLoading, error } = useTrailer({
    mediaId: id,
    mediaType: mediaType || 'movie',
    title,
  })

  // Build image URL
  const mediaCardImageBase = TMDB_CONFIG?.IMAGE_BASE_URL;
  const mediaCardImageSize = TMDB_CONFIG.IMAGE_SIZES?.poster?.medium || "w342";
  const mediaCardImageUrl =
    image && typeof image === "string" && image.startsWith("/")
      ? `${mediaCardImageBase}${mediaCardImageSize}${image}`
      : null;

  const mediaCardPosterUrl =
    poster && typeof poster === "string" && poster.startsWith("/")
      ? `${mediaCardImageBase}${mediaCardImageSize}${poster}`
      : null;

  const finalImageUrl = mediaCardImageUrl ?? mediaCardPosterUrl;

  // Determine link href
  const href =
    mediaType === "movie"
      ? `/movies/${id}`
      : mediaType === "tv"
        ? `/tv/${id}`
        : `/person/${id}`;

  const badgeLabel =
    mediaType === "movie" ? "Movie" : mediaType === "tv" ? "TV Show" : "Person";

  return (
    <Link
      href={href}
      className={cn(
        "mcrd-link-wrapper group flex flex-col w-full rounded-xl overflow-hidden",
        "border bg-mist-900 shadow-sm hover:shadow-md transition-all relative duration-200",
        className,
      )}
    >
      <div className="mcrd-image-relative-wrapper relative w-full h-full overflow-hidden">
        {finalImageUrl ? (
          <Image
            src={finalImageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 mask mask-b-from-black mask-b-from-60% mask-b-to-transparent"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
            No Image
          </div>
        )}

        {/* Play Trailer Button - only for movies and TV */}
        {mediaType !== "person" && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handlePlayTrailer()
            }}
            disabled={isLoading}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 hover:bg-black/50"
            aria-label="Play trailer"
          >
            <div className="w-12 h-12 rounded-full bg-red-primary/90 hover:bg-red-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-red-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-6 h-6 ml-0.5 fill-white" />
              )}
            </div>
          </button>
        )}

        {/* Badge Label */}
        <div 
          className="mcrd-badge-label absolute z-20 w-auto bottom-15 left-2 backdrop-blur-md text-[10px] uppercase text-white font-mono pl-2 pr-3.5 py-0.5 tracking-wider font-semibold bg-red-primary" 
          style={{ clipPath: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)" }}
        >
          {badgeLabel}
        </div>

        {/* Watchlist Button */}
        <WatchlistButton
          mediaId={id}
          mediaType={mediaType as "movie" | "tv"}
          title={title}
          poster={poster}
          rating={rating}
          year={year}
          variant="icon"
          className="right-1.5 absolute top-8.5"
        />

        {/* Rating Badge */}
        {mediaType !== "person" && rating > 0 && (
          <div
            className={`mcrd-rating-badge absolute top-2 right-2 backdrop-blur-md ${getRatingColor(rating)} text-xs px-2 py-0.5 rounded font-tektur flex bg-black/70 items-center gap-1`}
          >
            <span>
              <Star size="16" />
            </span>
            {rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Title and Year */}
      <div className="p-3 flex flex-1 flex-col justify-between gap-1 absolute bottom-0 left-0 w-full">
        <h3 className="mcrd-title text-sm font-sans font-medium tracking-wide text-gray-300 dark:text-gray-100 line-clamp-1 group-hover:text-red-primary transition-colors">
          {title}
        </h3>
        <p className="mcrd-year text-xs tracking-wider text-gray-400 dark:text-gray-500 font-mono">
          {year}
        </p>
      </div>
    </Link>
  )
}