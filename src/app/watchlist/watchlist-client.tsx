/**
 * WatchlistClient Component
 * Client-side UI for the watchlist:
 * - Tabs: All / Want to Watch / Watched
 * - Grid of items (rendered from snapshot data — no TMDB calls)
 * - Per-item actions: toggle status, remove
 */

'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Check, Eye, Loader2, Trash2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  toggleWatchlistStatusAction,
  removeFromWatchlistAction,
} from '@/app/actions/watchlist';
import { TMDB_CONFIG } from '@/lib/config/app.config';
import type {
  WatchlistItem,
  WatchlistStatus,
} from '@/db/schema';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface WatchlistClientProps {
  items: WatchlistItem[];
}

type TabValue = 'all' | 'want_to_watch' | 'watched';

// ============================================
// COMPONENT
// ============================================

export function WatchlistClient({ items }: WatchlistClientProps) {
  const [tab, setTab] = useState<TabValue>('all');

  // Local state for items — enables instant UI updates after actions
  const [localItems, setLocalItems] = useState(items);

  const filteredItems =
    tab === 'all' ? localItems : localItems.filter((i) => i.status === tab);

  const counts = {
    all: localItems.length,
    want_to_watch: localItems.filter((i) => i.status === 'want_to_watch').length,
    watched: localItems.filter((i) => i.status === 'watched').length,
  };

  // ─────────────────────────────────────
  // Empty watchlist (no items at all)
  // ─────────────────────────────────────
  if (localItems.length === 0) {
    return <WatchlistEmpty />;
  }

  return (
    <>
      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="want_to_watch">
            Want to Watch ({counts.want_to_watch})
          </TabsTrigger>
          <TabsTrigger value="watched">
            Watched ({counts.watched})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <TabEmpty tab={tab} />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] justify-items-stretch items-stretch gap-x-4 auto-rows-85 sm:auto-rows-90 md:auto-rows-105 gap-y-8 md:gap-9 w-full">
          {filteredItems.map((item) => (
            <WatchlistCard
              key={item.id}
              item={item}
              onRemove={() =>
                setLocalItems((prev) => prev.filter((i) => i.id !== item.id))
              }
              onStatusChange={(newStatus) =>
                setLocalItems((prev) =>
                  prev.map((i) =>
                    i.id === item.id
                      ? { ...i, status: newStatus, watchedAt: newStatus === 'watched' ? new Date() : null }
                      : i
                  )
                )
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

// ============================================
// WATCHLIST CARD
// ============================================

interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove: () => void;
  onStatusChange: (status: WatchlistStatus) => void;
}

function WatchlistCard({ item, onRemove, onStatusChange }: WatchlistCardProps) {
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<'toggle' | 'remove' | null>(null);

  const posterUrl = item.posterPath
    ? `${TMDB_CONFIG.image.baseUrl}/w342${item.posterPath}`
    : null;

  const href =
    item.mediaType === 'movie' ? `/movie/${item.tmdbId}` : `/tv/${item.tmdbId}`;

  const isWatched = item.status === 'watched';

  const handleToggle = () => {
    const newStatus: WatchlistStatus = isWatched ? 'want_to_watch' : 'watched';
    setActionType('toggle');

    startTransition(async () => {
      const result = await toggleWatchlistStatusAction(item.id, newStatus);
      if (result.success) {
        onStatusChange(newStatus);
      }
      setActionType(null);
    });
  };

  const handleRemove = () => {
    setActionType('remove');

    startTransition(async () => {
      const result = await removeFromWatchlistAction(item.tmdbId, item.mediaType);
      if (result.success) {
        onRemove();
      }
      setActionType(null);
    });
  };

  return (
    <div className="group flex flex-col">
      {/* Poster + overlay */}
      <div className="relative max-w-52 aspect-2/3 rounded-lg overflow-hidden bg-neutral-900 ring-1 ring-white/10">
        <Link href={href}>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-600 text-xs">
              No Image
            </div>
          )}
        </Link>

        {/* Status badge */}
        <div
          className={cn(
            'absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider',
            isWatched
              ? 'bg-green-600/90 text-white'
              : 'bg-blue-600/90 text-white'
          )}
        >
          {isWatched ? 'Watched' : 'Want to Watch'}
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending && actionType === 'remove'}
          aria-label={`Remove ${item.title} from watchlist`}
          className={cn(
            'absolute top-2 right-2 p-1.5 rounded-full',
            'bg-black/60 hover:bg-red-600 text-white',
            'transition-colors opacity-0 group-hover:opacity-100',
            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
          )}
        >
          {isPending && actionType === 'remove' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="mt-2 flex flex-col gap-1">
        <Link href={href}>
          <h3 className="text-sm font-medium truncate hover:text-primary transition-colors">
            {item.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {item.releaseYear && <span>{item.releaseYear}</span>}
          <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] uppercase">
            {item.mediaType === 'movie' ? 'Movie' : 'TV'}
          </span>
        </div>

        {/* Status toggle button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          disabled={isPending && actionType === 'toggle'}
          className="mt-1 h-7 text-xs justify-start px-2 text-muted-foreground hover:text-foreground"
        >
          {isPending && actionType === 'toggle' ? (
            <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
          ) : isWatched ? (
            <Bookmark className="w-3 h-3 mr-1.5" />
          ) : (
            <Eye className="w-3 h-3 mr-1.5" />
          )}
          {isWatched ? 'Move to Want to Watch' : 'Mark as Watched'}
        </Button>
      </div>
    </div>
  );
}

// ============================================
// EMPTY STATES
// ============================================

function WatchlistEmpty() {
  return (
    <div className="py-16 text-center">
      <Bookmark className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
      <h2 className="text-lg font-semibold text-white mb-2">
        Your watchlist is empty
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Browse movies and TV shows, and click "Add to Watchlist" to save them here.
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/movie">
          <Button variant="outline">Browse Movies</Button>
        </Link>
        <Link href="/tv">
          <Button variant="outline">Browse TV Shows</Button>
        </Link>
      </div>
    </div>
  );
}

function TabEmpty({ tab }: { tab: TabValue }) {
  const message =
    tab === 'watched'
      ? "You haven't marked anything as watched yet."
      : "You haven't added anything to want-to-watch yet.";

  return (
    <div className="py-16 text-center">
      <Check className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
