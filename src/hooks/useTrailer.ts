/**
 * useTrailer Hook
 * 
 * Custom hook for fetching and playing trailers.
 * Manages loading and error states with auto-dismissal.
 * Prevents trailer loading for person media type.
 */

'use client'

import { useState } from 'react'
import { useTrailerStore } from '@/store/trailer.store'
import { trailerService } from '@/services/tmdb/trailer.service'
import { UniversalMediaType } from '@/types/common'

interface UseTrailerOptions {
  mediaId: number
  mediaType: UniversalMediaType
  title: string
  onError?: (error: string) => void
}

interface UseTrailerReturn {
  handlePlayTrailer: () => Promise<void>
  isLoading: boolean
  error: string | null
  isAvailable: boolean
}

/**
 * useTrailer Hook
 * 
 * @param mediaId - TMDB media identifier
 * @param mediaType - Type of media (movie, tv, person)
 * @param title - Media title for display
 * @param onError - Optional error callback
 * @returns Trailer controls and state
 */
export function useTrailer({
  mediaId,
  mediaType,
  title,
  onError,
}: UseTrailerOptions): UseTrailerReturn {
  const { openTrailer } = useTrailerStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetches and opens the trailer
   */
  const handlePlayTrailer = async () => {
    // Trailers not available for people
    if (mediaType === 'person') {
      const msg = 'Trailers not available for people'
      setError(msg)
      onError?.(msg)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const trailer = await trailerService.getTrailer(
        mediaType as 'movie' | 'tv',
        mediaId
      )

      if (trailer) {
        openTrailer(trailer.key, `${title} - Trailer`)
      } else {
        const msg = 'No trailer available'
        setError(msg)
        onError?.(msg)
        setTimeout(() => setError(null), 3000)
      }
    } catch (err) {
      const msg = 'Failed to load trailer'
      setError(msg)
      onError?.(msg)
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handlePlayTrailer,
    isLoading,
    error,
    isAvailable: mediaType !== 'person',
  }
}