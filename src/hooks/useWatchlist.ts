/**
 * useWatchlist Hook
 * 
 * React Query hook for managing user watchlist with optimistic updates.
 * Provides add, remove, and check functionality with instant cache updates.
 * Uses Clerk for authentication and Sonner for toast notifications.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@clerk/nextjs'
import { watchlistService } from '@/services'
import { toast } from 'sonner'

/**
 * useWatchlist Hook
 * 
 * @returns Watchlist state, actions, and loading status
 */
export function useWatchlist() {
  const { isSignedIn, isLoaded } = useUser()
  const queryClient = useQueryClient()

  // Fetch watchlist items
  const {
    data: watchlist = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => watchlistService.getItems(),
    enabled: isSignedIn && isLoaded,
    staleTime: 0,
  })

  /**
   * Checks if a media item is in the watchlist
   * 
   * @param mediaId - TMDB media identifier
   * @param mediaType - Media type (movie or tv)
   * @returns boolean indicating if item exists
   */
  const isInWatchlist = (mediaId: number, mediaType: 'movie' | 'tv'): boolean => {
    if (!watchlist) return false
    return watchlist.some(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType
    )
  }

  // Add mutation with optimistic cache update
  const addMutation = useMutation({
    mutationFn: ({
      mediaId,
      mediaType,
      title,
      poster,
      rating,
      year,
    }: {
      mediaId: number
      mediaType: 'movie' | 'tv'
      title: string
      poster?: string | null
      rating?: number
      year?: string
    }) => watchlistService.addItem(mediaId, mediaType, title, poster, rating, year),
    onSuccess: (newItem) => {
      // Optimistically update cache
      queryClient.setQueryData(['watchlist'], (oldData: any[] | undefined) => {
        const currentData = oldData || []
        return [newItem, ...currentData]
      })
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
      toast.success('Added to watchlist!')
    },
    onError: () => {
      toast.error('Failed to add to watchlist')
    },
  })

  // Remove mutation with optimistic cache update
  const removeMutation = useMutation({
    mutationFn: ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) =>
      watchlistService.removeItem(mediaId, mediaType),
    onSuccess: (_, variables) => {
      // Optimistically update cache
      queryClient.setQueryData(['watchlist'], (oldData: any[] | undefined) => {
        if (!oldData) return []
        return oldData.filter(
          (item) => !(item.mediaId === variables.mediaId && item.mediaType === variables.mediaType)
        )
      })
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
      toast.success('Removed from watchlist!')
    },
    onError: () => {
      toast.error('Failed to remove from watchlist')
    },
  })

  /**
   * Toggles an item in the watchlist
   * Adds if not present, removes if present
   */
  const toggleWatchlist = async ({
    mediaId,
    mediaType,
    title,
    poster,
    rating,
    year,
  }: {
    mediaId: number
    mediaType: 'movie' | 'tv'
    title: string
    poster?: string | null
    rating?: number
    year?: string
  }) => {
    if (!isSignedIn) {
      toast.error('Please sign in to save to watchlist')
      return
    }

    const exists = isInWatchlist(mediaId, mediaType)

    if (exists) {
      await removeMutation.mutateAsync({ mediaId, mediaType })
    } else {
      await addMutation.mutateAsync({ mediaId, mediaType, title, poster, rating, year })
    }
  }

  return {
    watchlist,
    isLoading,
    error,
    isInWatchlist,
    toggleWatchlist,
    addToWatchlist: addMutation.mutate,
    removeFromWatchlist: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    refetch,
    isSignedIn,
  }
}