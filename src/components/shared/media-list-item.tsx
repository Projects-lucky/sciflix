/**
 * MediaListItem
 * Compact horizontal card: poster + title + media type + year (+ optional character)
 * Used by Known For and Filmography sections on the person detail page.
 */

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Play, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface MediaListItemData {
  id: number;
  title: string;
  mediaType: 'movie' | 'tv';
  year: string | null;
  posterUrl: string | null;
  /** Optional — shown in Filmography (e.g., "as Tyler Durden") */
  character?: string | null;
}

export interface MediaListItemProps {
  item: MediaListItemData;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function MediaListItem({ item, className }: MediaListItemProps) {
  const href =
    item.mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <Link
      href={href}
      className={cn(
        'flex flex-row items-stretch gap-3 rounded-xl p-2',
        'transition-colors duration-200',
        'hover:bg-accent/60',
        className
      )}
    >
      {/* Poster — 9:11 aspect */}
      <div className="shrink-0 w-16 aspect-[9/11] rounded-lg overflow-hidden bg-muted">
        {item.posterUrl ? (
          <Image
            src={item.posterUrl}
            alt={item.title}
            width={64}
            height={78}
            className="w-full h-full object-cover"
            unoptimized
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-[9px] text-muted-foreground">
            N/A
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        {/* Title */}
        <h3 className="text-base font-light tracking-tight truncate leading-snug">
          {item.title}
        </h3>

        {/* Character (Filmography only) */}
        {item.character && (
          <p className="text-xs text-muted-foreground truncate">
            as <span className="text-foreground/70">{item.character}</span>
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-row items-center gap-3 mt-1 overflow-hidden">
          {/* Media type badge */}
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide border',
              item.mediaType === 'movie'
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
            )}
          >
            {item.mediaType === 'movie' ? 'Movie' : 'TV'}
          </span>

          {/* Icon */}
          {item.mediaType === 'movie' ? (
            <Play className="w-3 h-3 text-indigo-400 fill-indigo-400/20" />
          ) : (
            <Tv className="w-3 h-3 text-sky-400" />
          )}

          {/* Year */}
          {item.year && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium whitespace-nowrap">
              <Calendar className="w-3 h-3 text-muted-foreground/70" />
              {item.year}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}