/**
 * TV Detail Page - Server Component
 * Route: /tv/[id]
 * Fetches TV details with credits, videos, and similar shows
 */

import { notFound } from 'next/navigation';
import { TVDetail } from '@/components/tv/tv-detail';
import { getTVDetails } from '@/lib/services/tmdb';
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

export default async function TVPage({ params }: PageProps) {
  const { id } = await params;

  // Parse and validate ID
  const tvId = Number(id);
  if (!Number.isInteger(tvId) || tvId <= 0) {
    notFound();
  }

  // Fetch TV with credits, videos, and similar in one call
  const tv = await getTVDetails(tvId, {
    append_to_response: 'credits,videos,similar',
  });

  // If API fails or TV doesn't exist, show 404
  if (!tv) {
    notFound();
  }

  return <TVDetail tv={tv} TvShowID={tvId} />;
}

// ============================================
// METADATA (SEO + OpenGraph)
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const tvId = Number(id);

  if (!Number.isInteger(tvId) || tvId <= 0) {
    return { title: 'Not Found' };
  }

  const tv = await getTVDetails(tvId);

  if (!tv) {
    return { title: 'TV Show Not Found' };
  }

  const firstYear = tv.first_air_date?.split('-')[0] || '';
  const title = firstYear ? `${tv.name} (${firstYear})` : tv.name;

  const description = tv.overview
    ? tv.overview.slice(0, 160)
    : `Details, cast, and trailer for ${tv.name}.`;

  const ogImage = tv.backdrop_path
    ? `${TMDB_CONFIG.image.baseUrl}/w1280${tv.backdrop_path}`
    : null;

  const images = ogImage
    ? [{ url: ogImage, width: 1280, height: 720, alt: tv.name }]
    : undefined;

  return {
    title,
    description,

    openGraph: {
      type: 'video.tv_show',
      title,
      description,
      url: `/tv/${tvId}`,
      images,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },

    alternates: {
      canonical: `/tv/${tvId}`,
    },
  };
}
