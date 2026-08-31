/**
 * Media Detail Component
 * 
 * Main container component for displaying detailed media information.
 * Composes MediaDetailContent, MediaCast, and MediaSimilar subcomponents.
 * Supports both movies and TV shows with consistent layout.
 */

'use client'

import { MediaDetailContent } from './MediaDetailContent'
import { MediaCast } from './MediaCast'
import { MediaSimilar } from './MediaSimilar'
import type { MovieDetails } from '@/types/movie'
import type { TVDetails } from '@/types/tv'
import type { UniversalMediaType } from '@/types/common'

interface MediaDetailProps {
  data: MovieDetails | TVDetails
  mediaType: UniversalMediaType
  similar: Array<{
    id: number
    title: string
    mediaType: UniversalMediaType
    poster: string | null
    rating: number
    year: string
  }>
  credits?: {
    cast: Array<{
      id: number
      name: string
      character?: string
      job?: string
      profile_path: string | null
    }>
    crew: Array<{
      id: number
      name: string
      job?: string
      profile_path: string | null
    }>
  }
}

/**
 * MediaDetail Component
 * 
 * @param data - Media details (movie or TV show)
 * @param mediaType - Type of media (movie or tv)
 * @param similar - Array of similar media items
 * @param credits - Cast and crew information
 * @returns Rendered media detail page
 */
export function MediaDetail({ data, mediaType, similar, credits }: MediaDetailProps) {
  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <MediaDetailContent data={data} mediaType={mediaType} />

      <div className="container mx-auto px-4 max-w-6xl">
        {credits && (
          <MediaCast cast={credits.cast || []} crew={credits.crew || []} />
        )}

        {similar.length > 0 && (
          <MediaSimilar items={similar} mediaType={mediaType} />
        )}
      </div>
    </article>
  )
}