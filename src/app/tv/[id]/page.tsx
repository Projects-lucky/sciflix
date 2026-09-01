/**
 * TV Show Detail Page
 *
 * Server component that displays detailed information about a TV show.
 * Fetches show details, cast/crew credits, and similar shows in parallel.
 * Uses on-demand ISR instead of static generation to avoid build-time fetch errors in CI.
 */

import { tvService } from '@/services/tmdb/tv.service'
import { notFound } from 'next/navigation'
import { MediaDetail } from '@/components/media/MediaDetail'

interface TVDetailPageProps {
  params: Promise<{ id: string }>
}

/**
 * Disable static generation at build time.
 * Pages are generated on-demand when users request them.
 */
export async function generateStaticParams() {
  return []
}

export const dynamicParams = true

/**
 * Generates metadata for SEO.
 *
 * @param params - Contains the TV show ID from the URL
 * @returns Page metadata including title and description
 */
export async function generateMetadata({ params }: TVDetailPageProps) {
  const { id } = await params
  const show = await tvService.getDetails(parseInt(id))

  return {
    title: `${show.name} - TV Show Details`,
    description: show.overview?.slice(0, 160) || 'TV show details',
  }
}

/**
 * TV Show Detail Page Component
 *
 * Fetches show details, similar shows, and credits concurrently.
 * Returns 404 if the show is not found or the ID is invalid.
 */
export default async function TVDetailPage({ params }: TVDetailPageProps) {
  const { id } = await params
  const tvId = parseInt(id)

  if (isNaN(tvId)) {
    notFound()
  }

  // Fetch show details, similar shows, and credits in parallel
  const [show, similar, credits] = await Promise.all([
    tvService.getDetails(tvId),
    tvService.getSimilar(tvId),
    tvService.getCredits(tvId),
  ])

  if (!show || !show.id) {
    notFound()
  }

  // Transform similar shows to match MediaDetail component props
  const similarShows = similar.results.slice(0, 10).map((s: any) => ({
    id: s.id,
    title: s.name,
    mediaType: 'tv' as const,
    poster: s.poster_path,
    rating: s.vote_average,
    year: s.first_air_date?.split('-')[0] || 'N/A',
  }))

  return (
    <section className="tv-details-page min-h-screen bg-gray-50 dark:bg-gray-950">
      <MediaDetail
        data={show}
        mediaType="tv"
        similar={similarShows}
        credits={{
          cast: credits.cast || [],
          crew: credits.crew || [],
        }}
      />
    </section>
  )
}
