"use client";

import { CarouselWrapper } from "@/components/shared/carousel-wrapper";
import { getGenreNameById } from "@/lib/services/tmdb/routes/genres";
import type { TMDBMovie } from "@/types/movie.types";
import type { TMDBTV } from "@/types/tv.types";
import { MovieCard } from "../movie/movie-card";

export interface GenreSectionProps {
  genreId: number;
  genreName?: string;
  mediaType: "movie" | "tv";
  items: TMDBMovie[] | TMDBTV[];
  className?: string;
}

export function GenreSection({
  genreId,
  genreName,
  // biome-ignore lint/correctness/noUnusedFunctionParameters: initial biome migration
  mediaType,
  items = [], // Default to empty array
  className,
}: GenreSectionProps) {
  //  Safe check with default
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  // biome-ignore lint/correctness/noUnusedVariables: initial biome migration
  const displayName = genreName || getGenreNameById(genreId);

  return (
    <CarouselWrapper
      items={items as TMDBMovie[]}
      renderItem={(item, index) => (
        <MovieCard
          item={item as TMDBMovie}
          variant="default"
          priority={index < 5}
          className="max-w-96 w-58 h-98"
        />
      )}
      showArrows={items.length > 5}
      showDots={false}
      autoPlay={false}
      className={className}
      title={genreName}
      showTitleBar={true}
      contentClassName="flex flex-row items-center gap-x-2.5"
      itemClassName="w-auto h-auto flex"
    />
  );
}
