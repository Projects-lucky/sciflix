/**
 * Watchlist Button Component
 * 
 * Toggle button for adding/removing items from user watchlist.
 * Supports icon and full variants with loading states.
 * Redirects to sign-in when user is not authenticated.
 */

'use client'

import { useState } from 'react'
import { Bookmark, BookmarkCheck, BookmarkPlus, Loader2 } from 'lucide-react'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useUser, SignInButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

interface WatchlistButtonProps {
  mediaId: number
  mediaType: 'movie' | 'tv'
  title: string
  poster?: string | null
  rating?: number | string 
  year?: string
  className?: string
  variant?: 'icon' | 'full'
}

/**
 * WatchlistButton Component
 * 
 * @param mediaId - TMDB media identifier
 * @param mediaType - Media type (movie or tv)
 * @param title - Media title
 * @param poster - Poster image path
 * @param rating - Vote average rating
 * @param year - Release year
 * @param className - Additional CSS classes
 * @param variant - Button style (icon or full)
 * @returns Rendered watchlist toggle button
 */
export function WatchlistButton({
  mediaId,
  mediaType,
  title,
  poster,
  rating,
  year,
  className,
  variant = 'full',
}: WatchlistButtonProps) {
  const { isSignedIn } = useUser()
  const { isInWatchlist, toggleWatchlist, isAdding, isRemoving } = useWatchlist()
  const [isLoading, setIsLoading] = useState(false)

  const isSaved = isInWatchlist(mediaId, mediaType)
  const isPending = isAdding || isRemoving || isLoading

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isSignedIn) return

    setIsLoading(true)
    try {
      // Ensure rating is a valid number
      const formattedRating = typeof rating === 'string' 
        ? parseFloat(rating) 
        : Number(rating || 0)

      await toggleWatchlist({
        mediaId,
        mediaType,
        title,
        poster: poster || null,
        rating: isNaN(formattedRating) ? 0 : formattedRating,
        year: year || 'N/A',
      })
    } catch (err) {
      console.error('Watchlist button execution failure:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Not signed in - show sign-in button
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button
          type="button"
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer',
            variant === 'icon' && 'p-2 rounded-full',
            className
          )}
        >
          <Bookmark className="w-4 h-4" />
          {variant === 'full' && 'Sign in to Save'}
        </button>
      </SignInButton>
    )
  }

  // Icon variant (for MediaCard)
  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          'p-1 rounded-full transition-all duration-200 backdrop-blur-sm',
          isSaved
            ? 'bg-red-500 text-white hover:bg-blue-600'
            : 'bg-black/50 text-white hover:bg-black/70',
          className
        )}
        aria-label={isSaved ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="w-5 h-5 fill-red-primary" />
        ) : (
          <Bookmark className="w-5 h-5" />
        )}
      </button>
    )
  }

  // Full variant (for MediaDetail)
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'wlb-btn flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
        isSaved
          ? 'bg-red-primary text-white hover:bg-red-primary'
          : 'bg-gray-200 dark:bg-neutral-800/75 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neutral-900',
        className
      )}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="w-5 h-5" />
      ) : (
        <BookmarkPlus className="w-5 h-5" />
      )}
      <span className="hidden md:block font-poppins tracking-wider">{isSaved ? 'In Watchlist' : 'Add to Watchlist'}</span>
    </button>
  )
}