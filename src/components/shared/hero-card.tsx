/**
 * HeroCard Component
 * Full-width hero for the trending carousel.
 *
 * - Buttons are independently interactive (no outer <Link> wrapper)
 * - Title + overview wrapped in their own <Link> to the detail page
 * - "Trailer" button opens the global trailer modal
 * - "Info" button navigates to the detail page
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TMDB_CONFIG } from '@/lib/config/app.config';
import { getGenreNameById } from '@/lib/services/tmdb/routes/genres';
import {
  isTrendingMovie,
  isTrendingTV,
  type TrendingItem,
} from '@/types/trending.types';
import { Info, Play, Star } from 'lucide-react';
import { WatchlistButton } from '@/components/watchlist/watchlist-button';
import { useTrailer, usePlayTrailer } from '@/lib/video/context';

// ============================================
// TYPES
// ============================================

export interface HeroCardProps {
  item: TrendingItem;
  className?: string;
  priority?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function HeroCard({ item, className, priority = false }: HeroCardProps) {
  const router = useRouter();

  // Hooks must be called unconditionally
  const mediaType: 'movie' | 'tv' =
    item && (isTrendingMovie(item) || isTrendingTV(item))
      ? isTrendingMovie(item)
        ? 'movie'
        : 'tv'
      : 'movie';
  const itemId = item?.id ?? 0;

  const { videoKey } = useTrailer(itemId, mediaType);
  const playTrailer = usePlayTrailer();

  // Skeleton (hooks already called above)
  if (!item) {
    return (
      <div className="w-full h-[65vh] md:h-[80vh] bg-linear-to-br from-neutral-900 to-neutral-950 animate-pulse flex items-end p-8">
        <div className="space-y-4 w-full max-w-xl">
          <div className="h-6 w-24 bg-neutral-800 rounded-full" />
          <div className="h-12 w-3/4 bg-neutral-800 rounded-xl" />
          <div className="h-4 w-full bg-neutral-800 rounded" />
          <div className="h-4 w-5/6 bg-neutral-800 rounded" />
        </div>
      </div>
    );
  }

  // Only movies and TV shows in hero
  if (!isTrendingMovie(item) && !isTrendingTV(item)) {
    return null;
  }

  const title = isTrendingMovie(item) ? item.title : item.name;
  const year = isTrendingMovie(item)
    ? item.release_date?.split('-')[0]
    : item.first_air_date?.split('-')[0];

  const href = isTrendingMovie(item)
    ? `/movie/${item.id}`
    : `/tv/${item.id}`;

  const mediaTypeLabel = isTrendingMovie(item) ? 'MOVIE' : 'SERIES';

  const backdropUrl = item.backdrop_path
    ? `${TMDB_CONFIG.image.baseUrl}/original${item.backdrop_path}`
    : null;

  const posterUrl = item.poster_path
    ? `${TMDB_CONFIG.image.baseUrl}/w342${item.poster_path}`
    : null;

  const imageUrl = backdropUrl || posterUrl;
  const rating = item.vote_average;
  const overview = item.overview;
  const genreNames =
    item.genre_ids?.slice(0, 2).map((id) => getGenreNameById(id)) || [];

  const ratingGlowColor =
    rating >= 7
      ? 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10'
      : rating >= 5
        ? 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30 shadow-amber-500/10'
        : 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30 shadow-rose-500/10';

  // ============================================
  // HANDLERS
  // ============================================

  const handlePlayTrailer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoKey) {
      playTrailer(videoKey, `${title} — Trailer`);
    }
  };

  const handleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className={cn(
        'hero-card-cnt flex w-full h-full group select-none relative overflow-hidden',
        className
      )}
    >
      <div className="relative w-full flex items-center h-150">
        {/* Immersive Image Base */}
        <div className="absolute w-full h-full inset-0 z-0 overflow-hidden mask-l-from-50% mask-l-to-90%">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out z-0 filter contrast-[1.05] brightness-[0.75] md:brightness-[0.85]"
              priority={priority}
              sizes="100vw"
              loading="eager"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-b from-neutral-900 to-neutral-950 z-0" />
          )}
        </div>

        {/* Content */}
        <div className="absolute h-full inset-0 flex flex-col items-start z-20 mx-5 py-3.5">
          <div className="relative w-full h-full container bg-amber-400/0">
            <div className="w-full flex flex-col items-start justify-end space-y-4 md:space-y-1 relative h-full bg-amber-200/0">
              {/* Badges */}
              <div className="flex flex-row flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 bg-linear-to-r font-tektur text-sm tracking-widest rounded-sm">
                  {mediaTypeLabel}
                </span>

                {rating > 0 && (
                  <span
                    className={cn(
                      'flex items-center gap-1.5 px-3 font-tektur',
                      ratingGlowColor
                    )}
                  >
                    <Star className="w-4 h-4" />
                    {rating.toFixed(1)} Rating
                  </span>
                )}

                {year && (
                  <span className="px-3 py-1 font-tektur">{year}</span>
                )}
              </div>

              {/* Title + Overview — clickable to detail page */}
              <Link
                href={href}
                className="contents"
                aria-label={`View details for ${title}`}
              >
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-oswald capitalize font-light tracking-wide leading-[1.05] mb-1.5 cursor-pointer">
                  {title}
                </h1>
              </Link>

              {/* Genre pills */}
              {genreNames.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm my-1.5">
                  {genreNames.map((genre, idx) => (
                    <span key={genre} className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 font-tektur font-extralight tracking-wider uppercase text-sm">
                        {genre}
                      </span>
                      {idx < genreNames.length - 1 && (
                        <span className="text-sm font-normal">•</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              {overview && (
                <Link href={href} className="contents my-0.5">
                  <div className="relative max-w-2xl group-hover:translate-x-0.5 transition-transform duration-500 cursor-pointer">
                    <p className="text-sm md:text-base line-clamp-3 md:line-clamp-4 leading-relaxed font-mono">
                      {overview}
                    </p>
                  </div>
                </Link>
              )}

              {/* CTA row */}
              <div className="pt-4 flex items-center gap-4">
                {/* Trailer button */}
                <button
                  type="button"
                  onClick={handlePlayTrailer}
                  disabled={!videoKey}
                  className="trailor flex items-center gap-2 border p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Play trailer for ${title}`}
                >
                  <Play className="size-9" />
                  <span className="text-2xl uppercase hidden md:block">
                    trailer
                  </span>
                </button>

                {/* Info button */}
                <button
                  type="button"
                  onClick={handleInfo}
                  className="trailor flex items-center gap-2 border p-2"
                  aria-label={`View details for ${title}`}
                >
                  <Info className="size-9" />
                  <span className="text-2xl uppercase hidden md:block">
                    info
                  </span>
                </button>

                {/* Watchlist button */}
                <span className="trailor flex items-center gap-2 border p-2">
                  <WatchlistButton
                    tmdbId={item.id}
                    mediaType={isTrendingMovie(item) ? 'movie' : 'tv'}
                    title={title}
                    posterPath={item.poster_path}
                    releaseYear={year}
                    iconClassName="size-9 text-yellow-400"
                    textClassName="font-tektur text-2xl uppercase hidden md:block"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}