/**
 * MovieDetail Component
 * Full movie detail presentation: hero, metadata, overview
 */

"use client";

import { Play, Star } from "lucide-react";
import Image from "next/image";
import { WatchlistButton } from "@/components/watchlist/watchlist-button";
import { TMDB_CONFIG } from "@/lib/config/app.config";
import { cn } from "@/lib/utils";
import { usePlayTrailer, useTrailer } from "@/lib/video/context";
import type { TMDBMovie, TMDBMovieDetail } from "@/types/movie.types";
import type { TMDBCredits, TMDBVideosResponse } from "@/types/tmdb.types";
import { CastCarousel } from "../shared/cast-carousel";
import { SimilarCarousel } from "../shared/similar-carousel";

// ============================================
// TYPES
// ============================================

type MovieDetailWithExtras = Omit<TMDBMovieDetail, "credits"> & {
  credits?: TMDBCredits;
  videos?: TMDBVideosResponse;
  similar?: {
    results: TMDBMovie[];
  };
};

export interface MovieDetailProps {
  movie: MovieDetailWithExtras;
  className?: string;
  movieID?: number;
}

// ============================================
// HELPERS
// ============================================

function formatRuntime(minutes: number | null): string | null {
  if (!minutes || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function formatCurrency(amount: number): string | null {
  if (!amount || amount <= 0) return null;
  if (amount >= 1_000_000_000)
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount}`;
}

function getDirector(
  crew?: Array<{ name: string; job: string }>,
): string | null {
  if (!crew) return null;
  const director = crew.find((c) => c.job === "Director");
  return director?.name || null;
}

// function getTrailerKey(videos?: TMDBVideosResponse): string | null {
//   if (!videos?.results) return null;

//   const trailer =
//     videos.results.find(
//       (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
//     ) ||
//     videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
//     videos.results.find((v) => v.site === "YouTube");

//   return trailer?.key || null;
// }

// ============================================
// COMPONENT
// ============================================

export function MovieDetail({ movie, movieID, className }: MovieDetailProps) {
  const title = movie.title;
  const year = movie.release_date?.split("-")[0] || null;
  const runtime = formatRuntime(movie.runtime);
  const rating = movie.vote_average;
  const voteCount = movie.vote_count;
  const genres = movie.genres || [];
  const director = getDirector(movie.credits?.crew);

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_CONFIG.image.baseUrl}/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `${TMDB_CONFIG.image.baseUrl}/w500${movie.poster_path}`
    : null;

  const ratingColor =
    rating >= 7
      ? "text-green-400"
      : rating >= 5
        ? "text-yellow-400"
        : "text-red-400";

  const mediaType = "movie";
  const { videoKey } = useTrailer(Number(movieID), mediaType);
  const playTrailer = usePlayTrailer();

  const hasTrailer = Boolean(videoKey);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoKey) playTrailer(videoKey, `${title} — Trailer`);
  };

  return (
    <div className={cn("min-h-screen", className)}>
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <div className="relative w-full min-h-[70vh] md:min-h-[80vh] bg-amber-700/70">
        {backdropUrl && (
          <div className="absolute inset-0 mask-b-from-5% mask-b-to-90%">
            <Image
              src={backdropUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              loading="eager"
              unoptimized
            />
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {posterUrl && (
              <div className="hidden md:block shrink-0">
                <div className="relative w-56 lg:w-64 aspect-2/3 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <Image
                    src={posterUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="256px"
                    loading="eager"
                    unoptimized
                  />
                </div>
              </div>
            )}

            <div className="flex-1 max-w-3xl space-y-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {title}
              </h1>

              {movie.tagline && (
                <p className="text-base md:text-lg text-gray-300 italic">
                  {movie.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                {year && <span className="text-gray-300">{year}</span>}
                {runtime && (
                  <>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-300">{runtime}</span>
                  </>
                )}
                <span className="text-gray-500">·</span>
                <span
                  className={cn(
                    "flex items-center gap-1 font-medium",
                    ratingColor,
                  )}
                >
                  <Star className="text-yellow-400 size-2.5" />{" "}
                  {rating.toFixed(1)}
                </span>
                {voteCount > 0 && (
                  <span className="text-gray-500 text-sm">
                    ({voteCount.toLocaleString()} votes)
                  </span>
                )}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 text-xs md:text-sm bg-white/10 text-white rounded-full backdrop-blur-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.overview && (
                <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-2xl">
                  {movie.overview}
                </p>
              )}

              {director && (
                <p className="text-sm text-gray-400">
                  <span className="text-gray-500">Director:</span>{" "}
                  <span className="text-white">{director}</span>
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {/* Trailer button — opens modal */}
                {hasTrailer && (
                  <button
                    type="button"
                    onClick={handlePlayClick}
                    className="inline-flex text-2xl font-poppins capitalize items-center gap-2 px-6 py-3 font-medium bg-transparent backdrop-blur-sm rounded-lg transition-colors"
                  >
                    <Play className="size-9" />
                    Play Trailer
                  </button>
                )}

                <WatchlistButton
                  tmdbId={movie.id}
                  mediaType="movie"
                  title={movie.title}
                  posterPath={movie.poster_path}
                  releaseYear={year}
                  iconClassName="size-8"
                  className="text-2xl font-poppins px-6 py-3 h-full capitalize flex flex-row items-center bg-transparent backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          DETAILS GRID
          ============================================ */}
      <div className="mx-auto px-4 md:px-8 py-12 bg-linear-to-t from-blue-700/0 via-blue-700/60/0 to-amber-700/70">
        <h2 className="text-2xl md:text-3xl font-semibold font-poppins mb-6">
          Details
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <DetailItem label="Status" value={movie.status} />
          <DetailItem label="Release Date" value={movie.release_date} />
          <DetailItem label="Runtime" value={runtime} />
          <DetailItem
            label="Original Language"
            value={movie.original_language?.toUpperCase()}
          />
          <DetailItem label="Budget" value={formatCurrency(movie.budget)} />
          <DetailItem label="Revenue" value={formatCurrency(movie.revenue)} />
          <DetailItem
            label="Production Countries"
            value={movie.production_countries?.map((c) => c.name).join(", ")}
          />
          <DetailItem
            label="Spoken Languages"
            value={movie.spoken_languages
              ?.map((l) => l.english_name)
              .join(", ")}
          />
        </div>
      </div>

      {/* Cast */}
      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <div className="mx-auto px-4 md:px-8 pb-8">
          <span className="text-2xl font-semibold mb-4">Cast</span>
          <CastCarousel cast={movie.credits.cast} title="Cast" />
        </div>
      )}

      {/* Similar Movies */}
      {movie.similar?.results && movie.similar.results.length > 0 && (
        <div className="mx-auto px-4 md:px-8 pb-12">
          <span className="text-2xl font-semibold mb-4">Similar Movies</span>
          <SimilarCarousel
            items={movie.similar.results}
            mediaType="movie"
            title="Similar Movies"
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// DETAIL ITEM SUB-COMPONENT
// ============================================

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm md:text-base">{value}</p>
    </div>
  );
}
