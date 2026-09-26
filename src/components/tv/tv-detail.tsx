/**
 * TVDetail Component
 * Full TV show detail presentation: hero, seasons, metadata, overview
 */

"use client";

import { Play, Star, Vote } from "lucide-react";
import Image from "next/image";
import { WatchlistButton } from "@/components/watchlist/watchlist-button";
import { TMDB_CONFIG } from "@/lib/config/app.config";
import { cn } from "@/lib/utils";
import { usePlayTrailer, useTrailer } from "@/lib/video/context";
import type { TMDBCredits, TMDBVideosResponse } from "@/types/tmdb.types";
import type { TMDBTV, TMDBTVDetail } from "@/types/tv.types";
import { CastCarousel } from "../shared/cast-carousel";
import { SimilarCarousel } from "../shared/similar-carousel";

// ============================================
// TYPES
// ============================================

type TVDetailWithExtras = Omit<TMDBTVDetail, "credits"> & {
  credits?: TMDBCredits;
  videos?: TMDBVideosResponse;
  similar?: {
    results: TMDBTV[];
  };
};

export interface TVDetailProps {
  tv: TVDetailWithExtras;
  TvShowID?: number;
  className?: string;
}

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getCreator(tv: TMDBTVDetail): string | null {
  if (!tv.created_by || tv.created_by.length === 0) return null;
  return tv.created_by.map((c) => c.name).join(", ");
}

function getTrailerKey(videos?: TMDBVideosResponse): string | null {
  if (!videos?.results) return null;

  const trailer =
    videos.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
    ) ||
    videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.results.find((v) => v.site === "YouTube");

  return trailer?.key || null;
}

// ============================================
// COMPONENT
// ============================================

export function TVDetail({ tv, TvShowID, className }: TVDetailProps) {
  const title = tv.name;
  const firstYear = tv.first_air_date?.split("-")[0] || null;
  const lastYear = tv.last_air_date?.split("-")[0] || null;
  const rating = tv.vote_average;
  const voteCount = tv.vote_count;
  const genres = tv.genres || [];
  const creator = getCreator(tv);

  const yearRange =
    firstYear && lastYear && firstYear !== lastYear
      ? `${firstYear} – ${lastYear}`
      : firstYear || null;

  const backdropUrl = tv.backdrop_path
    ? `${TMDB_CONFIG.image.baseUrl}/original${tv.backdrop_path}`
    : null;

  const posterUrl = tv.poster_path
    ? `${TMDB_CONFIG.image.baseUrl}/w500${tv.poster_path}`
    : null;

  const ratingColor =
    rating >= 7
      ? "text-green-400"
      : rating >= 5
        ? "text-yellow-400"
        : "text-red-400";

  const mediaType = "tv";
  const { videoKey } = useTrailer(Number(TvShowID), mediaType);
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
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold font-poppins text-amber-50 leading-tight">
                {title}
              </h1>

              {tv.tagline && (
                <p className="text-base md:text-lg text-gray-300 italic">
                  {tv.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                {yearRange && (
                  <span className="text-gray-300">{yearRange}</span>
                )}

                {tv.number_of_seasons > 0 && (
                  <>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-300">
                      {tv.number_of_seasons}{" "}
                      {tv.number_of_seasons === 1 ? "Season" : "Seasons"}
                    </span>
                  </>
                )}

                {tv.number_of_episodes > 0 && (
                  <>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-300">
                      {tv.number_of_episodes} Episodes
                    </span>
                  </>
                )}

                <span className="text-gray-500">·</span>
                <span
                  className={cn(
                    "flex flex-row items-center gap-1 font-medium",
                    ratingColor,
                  )}
                >
                  <Star className="size-4" /> {rating.toFixed(1)}
                </span>

                {voteCount > 0 && (
                  <span className="flex flex-row items-center gap-1 text-gray-400 text-sm">
                    <Vote className="size-4 text-green-500" />
                    {voteCount.toLocaleString()} votes
                  </span>
                )}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 text-sm bg-white/10 text-white rounded-full font-poppins font-light backdrop-blur-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {tv.overview && (
                <p className="text-md font-poppins tracking-wide md:text-base text-gray-200 leading-relaxed max-w-2xl">
                  {tv.overview}
                </p>
              )}

              {creator && (
                <p className="text-sm text-gray-400">
                  <span className="text-gray-200">Created by:</span>{" "}
                  <span className="text-white">{creator}</span>
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
                  tmdbId={tv.id}
                  mediaType="tv"
                  title={tv.name}
                  posterPath={tv.poster_path}
                  releaseYear={firstYear}
                  iconClassName="size-8"
                  className="text-2xl font-poppins px-6 py-3 h-full capitalize flex flex-row items-center bg-transparent backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          SEASONS SECTION
          ============================================ */}
      {tv.seasons && tv.seasons.length > 0 && (
        <div className="mx-auto px-4 md:px-8 py-12 bg-radial from-blue-700/0 via-amber-700/70 to-amber-700/70">
          <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-6">
            Seasons
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tv.seasons
              .filter((s) => s.season_number > 0)
              .map((season) => (
                <SeasonCard key={season.id} season={season} />
              ))}
          </div>
        </div>
      )}

      {/* ============================================
          DETAILS GRID
          ============================================ */}
      <div className="mx-auto px-4 md:px-8 py-12 bg-linear-to-t from-blue-700/0 via-blue-700/60/0 to-amber-700/70">
        <h2 className="text-2xl md:text-3xl font-poppins mb-6">Details</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <DetailItem label="Status" value={tv.status} />
          <DetailItem
            label="First Air Date"
            value={formatDate(tv.first_air_date)}
          />
          <DetailItem
            label="Last Air Date"
            value={formatDate(tv.last_air_date)}
          />
          <DetailItem
            label="Original Language"
            value={tv.original_language?.toUpperCase()}
          />
          <DetailItem label="Type" value={tv.type} />
          <DetailItem
            label="Networks"
            value={tv.networks?.map((n) => n.name).join(", ")}
          />
          <DetailItem
            label="Production Countries"
            value={tv.production_countries?.map((c) => c.name).join(", ")}
          />
          <DetailItem
            label="Spoken Languages"
            value={tv.spoken_languages?.map((l) => l.english_name).join(", ")}
          />
        </div>
      </div>

      {/* Cast */}
      {tv.credits?.cast && tv.credits.cast.length > 0 && (
        <div className=" mx-auto px-4 md:px-8 pb-8">
          <span className="text-2xl font-semibold mb-4 capitalize">Cast</span>
          <CastCarousel cast={tv.credits.cast} title="Cast" />
        </div>
      )}

      {/* Similar TV Shows */}
      {tv.similar?.results && tv.similar.results.length > 0 && (
        <div className=" mx-auto px-4 md:px-8 pb-12">
          <span className="text-2xl font-semibold mb-4 capitalize">
            Similar shows
          </span>
          <SimilarCarousel
            items={tv.similar.results}
            mediaType="tv"
            title="Similar TV Shows"
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// SEASON CARD SUB-COMPONENT
// ============================================

interface SeasonCardProps {
  season: {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    episode_count: number;
    air_date: string | null;
    vote_average: number;
  };
}

function SeasonCard({ season }: SeasonCardProps) {
  const posterUrl = season.poster_path
    ? `${TMDB_CONFIG.image.baseUrl}/w342${season.poster_path}`
    : null;

  const airYear = season.air_date?.split("-")[0] || null;

  return (
    <div className="group">
      <div className="relative max-w-52 aspect-2/3 rounded-lg overflow-hidden bg-neutral-900 ring-1 ring-white/10">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={season.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="eager"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
            No Image
          </div>
        )}

        <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-700 backdrop-blur-lg rounded text-xs font-poppins tracking-wider text-gray-100">
          Season {season.season_number}
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-lg font-medium font-poppins truncate line-clamp-1">
          {season.name}
        </h3>
        <p className="text-sm text-gray-300 font-poppins truncate line-clamp-1">
          {season.episode_count} Episodes
          {airYear && ` · ${airYear}`}
        </p>
      </div>
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
