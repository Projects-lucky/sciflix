/**
 * Movie Detail Page
 * 
 * Renders detailed information for a specific movie using TMDB data.
 * Includes movie details, cast/crew credits, and similar movie recommendations.
 * 
 * Supports static generation for the first 10 popular movies.
 */

import { moviesService } from '@/services/tmdb/movies.service'
import { notFound } from 'next/navigation'
import { MediaDetail } from '@/components/media/MediaDetail'

export const dynamic = 'force-dynamic'


interface MovieDetailPageProps {
  params: Promise<{ id: string }>
}

/**
 * Generates static paths for the first 10 popular movies.
 * Improves performance by pre-rendering these pages at build time.
 * 
 * @returns Array of parameter objects containing movie IDs
 */
export async function generateStaticParams() {
<<<<<<< HEAD
  return []
}

/**
 * Enable dynamic rendering for all movie IDs.
 * Pages will be generated on first request and cached via ISR.
 */
export const dynamicParams = true

=======
  const popular = await moviesService.getPopular(1)
  return popular.results.slice(0, 10).map((movie) => ({
    id: String(movie.id),
  }))
}

>>>>>>> d6424eb (Build successful: ready for deployment)
/**
 * Generates metadata for SEO.
 * 
 * @param params - Contains the movie ID from the URL
 * @returns Page metadata including title and description
 */
export async function generateMetadata({ params }: MovieDetailPageProps) {
  const { id } = await params
  const movie = await moviesService.getDetails(parseInt(id))

  return {
    title: `${movie.title} - Movie Details`,
    description: movie.overview?.slice(0, 160) || 'Movie details',
  }
}

/**
 * Movie Detail Page Component
 * 
 * Fetches movie details, credits, and similar movies in parallel.
 * Returns 404 if the movie is not found or the ID is invalid.
 */
export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params
  const movieId = parseInt(id)

  if (isNaN(movieId)) {
    notFound()
  }

  // Fetch movie details, similar movies, and credits concurrently
  const [movie, similar, credits] = await Promise.all([
    moviesService.getDetails(movieId),
    moviesService.getSimilar(movieId),
    moviesService.getCredits(movieId),
  ])

  if (!movie || !movie.id) {
    notFound()
  }

  // Transform similar movies to match the MediaDetail component's expected format
  const similarMovies = similar.results.slice(0, 10).map((m) => ({
    id: m.id,
    title: m.title,
    mediaType: 'movie' as const,
    poster: m.poster_path,
    rating: m.vote_average,
    year: m.release_date?.split('-')[0] || 'N/A',
  }))

  return (
    <section className="movie-detail-page min-h-screen bg-gray-50 dark:bg-gray-950">
      <MediaDetail
        data={movie}
        mediaType="movie"
        similar={similarMovies}
        credits={{
          cast: credits.cast || [],
          crew: credits.crew || [],
        }}
      />
    </section>
  )
}