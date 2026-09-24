/**
 * Movie Detail Page - Server Component
 * Route: /movie/[id]
 * Fetches movie details with credits, videos, and similar movies
 */

import { notFound } from 'next/navigation';
import { MovieDetail } from '@/components/movie/movie-detail';
import { getMovieDetails } from '@/lib/services/tmdb';
import { TMDB_CONFIG } from '@/lib/config/app.config';
import type { Metadata } from 'next';

// ============================================
// TYPES
// ============================================

interface PageProps {
  params: Promise<{ id: string }>;
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;

  // Parse and validate ID
  const movieId = Number(id);
  if (!Number.isInteger(movieId) || movieId <= 0) {
    notFound();
  }

  // Fetch movie with credits, videos, and similar in one call
  const movie = await getMovieDetails(movieId, {
    append_to_response: 'credits,videos,similar',
  });

  // If API fails or movie doesn't exist, show 404
  if (!movie) {
    notFound();
  }

  return <MovieDetail movie={movie} movieID={movieId} />;
}

// ============================================
// METADATA (SEO + OpenGraph)
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    return { title: 'Not Found' };
  }

  const movie = await getMovieDetails(movieId);

  if (!movie) {
    return { title: 'Movie Not Found' };
  }

  const year = movie.release_date?.split('-')[0] || '';
  const title = year ? `${movie.title} (${year})` : movie.title;

  // Description: prefer overview, truncated for OG (recommended ~160 chars)
  const description = movie.overview
    ? movie.overview.slice(0, 160)
    : `Details, cast, and trailer for ${movie.title}.`;

  // OG image: backdrop at w1280 (16:9)
  const ogImage = movie.backdrop_path
    ? `${TMDB_CONFIG.image.baseUrl}/w1280${movie.backdrop_path}`
    : null;

  const images = ogImage
    ? [{ url: ogImage, width: 1280, height: 720, alt: movie.title }]
    : undefined;

  return {
    title,
    description,

    openGraph: {
      type: 'video.movie',
      title,
      description,
      url: `/movie/${movieId}`,
      images,
      // Optional: release date helps some crawlers
      ...(movie.release_date && { releaseDate: movie.release_date }),
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },

    // Canonical URL — prevents duplicate content
    alternates: {
      canonical: `/movie/${movieId}`,
    },
  };
}