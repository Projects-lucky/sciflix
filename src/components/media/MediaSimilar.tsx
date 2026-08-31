/**
 * Media Similar Component
 * 
 * Displays similar movies or TV shows using the MediaGrid component.
 * Renders a section with title based on media type.
 * Returns null when no items are available.
 */

'use client'

import { MediaGrid } from '@/components/shared/MediaGrid'
import type { UniversalMediaType } from '@/types/common'

interface MediaSimilarProps {
  items: Array<{
    id: number
    title: string
    mediaType: UniversalMediaType
    poster: string | null
    rating: number
    year: string
  }>
  mediaType: UniversalMediaType
}

/**
 * MediaSimilar Component
 * 
 * @param items - Array of similar media items
 * @param mediaType - Type of media (movie or tv)
 * @returns Rendered similar media section or null
 */
export function MediaSimilar({ items, mediaType }: MediaSimilarProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="my-11">
      <h2 className="text-2xl font-semibold font-poppins my-3 mx-1">
        Similar {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
      </h2>
      <MediaGrid items={items} />
    </section>
  )
}