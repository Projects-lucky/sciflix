/**
 * WatchlistButton Component
 * Adds/removes items from the user's watchlist.
 *
 * Behavior:
 * - Always shows "Add to Watchlist" (or "In Watchlist" once saved)
 * - Signed out + click → toast: "Sign in to save items" with action
 * - Signed in + click → performs add/remove, swaps icon + color
 *
 * States:
 * - Not saved: outline Bookmark icon, neutral background
 * - Saved:     filled BookmarkCheck icon, green background
 *
 * Variants:
 * - 'default' → text + icon, standard button
 * - 'icon'    → icon-only, for card overlays
 * - 'full'    → full-width button, for drawers
 */

"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addToWatchlistAction,
  isInWatchlistAction,
  removeFromWatchlistAction,
} from "@/app/actions/watchlist";
import { Button } from "@/components/ui/button";
import type { MediaType } from "@/db/schema";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface WatchlistButtonProps {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath?: string | null;
  releaseYear?: string | null;
  variant?: "default" | "icon" | "full";
  className?: string;
  iconClassName?: string; // ← NEW: Control icon size/styles externally
  textClassName?: string; // ← NEW: Control text styles externally
}

// ============================================
// COMPONENT
// ============================================

export function WatchlistButton({
  tmdbId,
  mediaType,
  title,
  posterPath,
  releaseYear,
  variant = "default",
  className,
  iconClassName, // ← Destructure here
  textClassName, // ← Destructure here
}: WatchlistButtonProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const clerk = useClerk();
  const [isPending, startTransition] = useTransition();
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  // ─────────────────────────────────────
  // Check initial state (only when signed in)
  // ─────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setInWatchlist(false);
      setCheckedAuth(true);
      return;
    }

    let cancelled = false;

    isInWatchlistAction(tmdbId, mediaType).then((result) => {
      if (!cancelled) {
        setInWatchlist(result);
        setCheckedAuth(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [tmdbId, mediaType, isSignedIn, isLoaded]);

  // ─────────────────────────────────────
  // Signed out → show toast prompting sign-in
  // ─────────────────────────────────────
  const promptSignIn = () => {
    toast("Sign in to save items", {
      description: "Create a free account to build your watchlist.",
      action: {
        label: "Sign In",
        onClick: () => clerk.openSignIn(),
      },
      duration: 5000,
    });
  };

  // ─────────────────────────────────────
  // Click handler
  // ─────────────────────────────────────
  const handleClick = () => {
    if (!isSignedIn) {
      promptSignIn();
      return;
    }

    startTransition(async () => {
      if (inWatchlist) {
        // Remove
        const result = await removeFromWatchlistAction(tmdbId, mediaType);
        if (result.success) {
          setInWatchlist(false);
          toast.success("Removed from watchlist");
        } else {
          toast.error(result.error || "Failed to remove");
        }
      } else {
        // Add
        const result = await addToWatchlistAction({
          tmdbId,
          mediaType,
          title,
          posterPath: posterPath ?? null,
          releaseYear: releaseYear ?? null,
        });
        if (result.success) {
          setInWatchlist(true);
          toast.success("Added to watchlist");
        } else {
          toast.error(result.error || "Failed to add");
        }
      }
    });
  };

  // ─────────────────────────────────────
  // Visual state
  // ─────────────────────────────────────
  const isIconOnly = variant === "icon";
  const isFullWidth = variant === "full";

  const Icon = inWatchlist ? BookmarkCheck : Bookmark;
  const label = inWatchlist ? "In Watchlist" : "Add to Watchlist";

  // Loading state until we know auth + watchlist status
  const isLoading = !isLoaded || (isSignedIn && !checkedAuth);

  return (
    <Button
      type="button"
      variant={inWatchlist ? "default" : "outline"}
      size={isIconOnly ? "icon" : "default"}
      onClick={handleClick}
      disabled={isPending || isLoading}
      aria-pressed={inWatchlist}
      aria-label={label}
      title={label}
      className={cn(
        "transition-all",
        isFullWidth && "w-full",
        // Saved state: green
        inWatchlist && "",
        // Not saved: neutral outline
        !inWatchlist && "",
        className,
      )}
    >
      {isPending || isLoading ? (
        <Loader2 className={cn("size-4 animate-spin", iconClassName)} />
      ) : (
        <Icon className={cn("size-4", iconClassName)} />
      )}
      {!isIconOnly && (
        <span className={cn("ml-2", textClassName)}>
          {isPending ? "Saving..." : label}
        </span>
      )}
    </Button>
  );
}
