/**
 * Media Detail Content Component
 * 
 * Displays detailed information for a movie or TV show with a cinematic hero layout.
 * Includes backdrop with parallax effect, title, metadata, overview, and action buttons.
 * Uses useTrailer hook for trailer playback functionality.
 */

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Star, ArrowUpRight, ArrowLeft } from 'lucide-react'
import type { MovieDetails } from '@/types/movie'
import type { TVDetails } from '@/types/tv'
import type { UniversalMediaType } from '@/types/common'
import { TMDB_CONFIG } from '@/constants'
import { useTrailer } from '@/hooks/useTrailer'

interface MediaDetailContentProps {
  data: MovieDetails | TVDetails
  mediaType: UniversalMediaType
}

// Type guard helpers
const isMovieData = (data: any): data is MovieDetails => 'title' in data
const isTVData = (data: any): data is TVDetails => 'name' in data

const IMAGE_BASE_URL = TMDB_CONFIG.IMAGE_BASE_URL

/**
 * MediaDetailContent Component
 * 
 * @param data - Media details (movie or TV show)
 * @param mediaType - Type of media (movie or tv)
 * @returns Rendered media detail content
 */
export function MediaDetailContent({ data, mediaType }: MediaDetailContentProps) {
  const [scrollY, setScrollY] = useState(0)

  const { handlePlayTrailer, isLoading, error } = useTrailer({
    mediaId: data.id,
    mediaType,
    title: isMovieData(data) ? data.title : data.name,
  })

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const title = isMovieData(data) ? data.title : data.name
  const releaseDate = isMovieData(data) ? data.release_date : data.first_air_date
  const runtime = isMovieData(data) ? data.runtime : data.episode_run_time?.[0]
  const status = data.status
  const backdrop = data.backdrop_path
  const rating = data.vote_average
  const homepage = data.homepage
  const tmdbId = data.id
  const numberOfSeasons = isTVData(data) ? data.number_of_seasons : undefined
  const numberOfEpisodes = isTVData(data) ? data.number_of_episodes : undefined

  const backdropUrl = backdrop ? `${IMAGE_BASE_URL}/w1280${backdrop}` : '/placeholder-backdrop.jpg'
  const releaseYear = releaseDate?.split('-')[0] || 'N/A'

  return (
    <div className="min-h-screen bg-black text-neutral-100 selection:bg-neutral-800 selection:text-white pb-32">
      {/* Hero Backdrop with Parallax */}
      <div className="relative h-[80vh] w-full overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0 transition-transform duration-100 ease-out" style={{ transform: `translateY(${scrollY * 0.25}px)` }}>
          <Image src={backdropUrl} alt={title} fill className="object-cover opacity-70 filter contrast-125 brightness-75 scale-105" priority />
          <div className="absolute inset-0 bg-lienear-to-t from-black via-black/20 to-transparent" />
        </div>

        {/* Title and Metadata */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-12">
          <Link href={mediaType === 'movie' ? '/movies' : '/tv'} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition mb-6 font-mono">
            <ArrowLeft className="w-3 h-3" /> Catalog
          </Link>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter uppercase mb-6 text-white leading-none">{title}</h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-400 font-mono">
            <span className="flex items-center gap-1 text-amber-400 font-bold"><Star className="w-3.5 h-3.5 fill-amber-400" /> {rating?.toFixed(1)}</span>
            <span>•</span><span>{releaseYear}</span>
            {runtime && <><span className="text-neutral-700">•</span><span>{runtime} min</span></>}
            {numberOfSeasons && <><span className="text-neutral-700">•</span><span>{numberOfSeasons} Seasons</span></>}
            <span className="text-neutral-700">•</span><span className="uppercase text-xs tracking-wider text-white border border-neutral-800 px-2 py-0.5 rounded">{status}</span>
          </div>
        </div>
      </div>

      {/* Overview and Details */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 items-start">
        {/* Overview Section */}
        <div className="lg:col-span-2 space-y-8">
          <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed font-light tracking-wide">{data.overview || 'Overview unavailable.'}</p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={handlePlayTrailer} disabled={isLoading} className="flex items-center gap-3 bg-white text-red-primary rounded px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-red-primary" />
              )}
              {isLoading ? 'Loading...' : 'Play Preview'}
            </button>
            {homepage && <a href={homepage} target="_blank" rel="noopener" className="flex items-center gap-1 text-xs uppercase tracking-widest border border-neutral-800 px-4 py-3 rounded hover:bg-neutral-900 transition text-neutral-300">Website <ArrowUpRight className="w-3 h-3" /></a>}
            {tmdbId && <a href={`https://themoviedb.org${mediaType === 'movie' ? 'movie' : 'tv'}/${tmdbId}`} target="_blank" rel="noopener" className="flex items-center gap-1 text-xs uppercase tracking-widest border border-neutral-800 px-4 py-3 rounded hover:bg-neutral-900 transition text-neutral-300">TMDB <ArrowUpRight className="w-3 h-3" /></a>}
          </div>
          {error && <p className="text-xs text-red-primary font-mono">{error}</p>}
        </div>

        {/* Spec Sheet */}
        <div className="border-t lg:border-t-0 lg:border-l border-neutral-900 pt-8 lg:pt-0 lg:pl-12 grid grid-cols-2 gap-x-6 gap-y-8 text-sm font-mono">
          {isMovieData(data) && data.budget ? (
            <div>
              <p className="text-red-primary text-xs uppercase tracking-widest mb-1">Budget</p>
              <p className="text-neutral-200">${data.budget.toLocaleString()}</p>
            </div>
          ) : null}
          {isMovieData(data) && data.revenue ? (
            <div>
              <p className="text-red-primary text-xs uppercase tracking-widest mb-1">Revenue</p>
              <p className="text-emerald-500">${data.revenue.toLocaleString()}</p>
            </div>
          ) : null}
          <div>
            <p className="text-red-primary text-xs uppercase tracking-widest mb-1">Release Date</p>
            <p className="text-neutral-200">{releaseDate || 'N/A'}</p>
          </div>
          {numberOfEpisodes && (
            <div>
              <p className="text-red-primary text-xs uppercase tracking-widest mb-1">Episodes</p>
              <p className="text-neutral-200">{numberOfEpisodes}</p>
            </div>
          )}
          {data.genres && data.genres.length > 0 && (
            <div className="col-span-2">
              <p className="text-red-primary text-xs uppercase tracking-widest mb-2">Genres</p>
              <div className="flex flex-wrap gap-1.5">
                {data.genres.map((g: any) => <span key={g.id} className="text-xs text-neutral-400 bg-neutral-950 px-2 py-1 rounded border border-neutral-900">{g.name}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}