/**
 * SimilarCarousel Component
 * Displays similar movies or TV shows in a horizontal carousel
 * Reuses CarouselWrapper + MovieCard
 * Works for both movies and TV shows
 */

"use client";

import type { TMDBMovie } from "@/types/movie.types";
import type { TMDBTV } from "@/types/tv.types";
import { MovieCard } from "../movie/movie-card";
import { CarouselWrapper } from "./carousel-wrapper";

// ============================================
// TYPES
// ============================================

export interface SimilarCarouselProps {
  items: (TMDBMovie | TMDBTV)[];
  mediaType: "movie" | "tv";
  title?: string;
  limit?: number;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function SimilarCarousel({
  items,
  // biome-ignore lint/correctness/noUnusedFunctionParameters: initial biome migration
  mediaType,
  title = "Similar",
  limit = 12,
  className,
}: SimilarCarouselProps) {
  if (!items || items.length === 0) return null;

  const limited = items.slice(0, limit);

  return (
    <CarouselWrapper
      items={limited}
      renderItem={(item) => (
        <MovieCard item={item} className="max-w-96 w-48 h-82" />
      )}
      renderKey={(item) => item.id}
      title={title}
      showArrows={true}
      showDots={false}
      className={className}
    />
  );
}
