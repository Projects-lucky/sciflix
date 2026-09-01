/**
 * TV Show Detail Page
 *
 * Server component that displays detailed information about a TV show.
 * Fetches show details, cast/crew credits, and similar shows in parallel.
 * Supports static generation for the first 10 popular TV shows.
 */

import { tvService } from '@/services/tmdb/tv.service'
import { notFound } from 'next/navigation'
import { MediaDetail } from '@/components/media/MediaDetail'

interface TVDetailPageProps {
  params: Promise<{ id: string }>
}

/**
 * Generates static paths for the first 10 popular TV shows.
 * Pre-renders these pages at build time for improved performance.
 *
 * @returns Array of parameter objects containing TV show IDs
 */
export async function generateStaticParams() {
  const popular = await tvService.getPopular(1)
  return popular.results.slice(0, 10).map((show) => ({
    id: String(show.id),
  }))
}

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
