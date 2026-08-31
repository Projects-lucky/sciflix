/**
 * Global Trailer Modal Component
 * 
 * Renders a full-screen modal for playing YouTube trailers.
 * Uses createPortal to render at document.body level.
 * Locks body scroll when open and closes on Escape key.
 * Supports autoplay and responsive iframe sizing.
 */

'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useTrailerStore } from '@/store/trailer.store'

/**
 * GlobalTrailerModal Component
 * 
 * @returns Rendered modal portal or null if not open
 */
export function GlobalTrailerModal() {
  const { isOpen, videoKey, title, closeTrailer } = useTrailerStore()

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTrailer()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeTrailer])

  if (!isOpen || !videoKey) return null

  const youtubeUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`

  // Render at document.body level using createPortal
  return createPortal(
    <div
      className="gtm-cnt-wrapper fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={closeTrailer}
    >
      <div
        className="gtm-cnt relative w-full max-w-4xl mx-4 bg-black rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeTrailer}
          className="gtm-close-btn absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          aria-label="Close trailer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="gtm-title absolute top-3 left-4 z-10 text-white font-semibold text-sm truncate max-w-[70%]">
          {title}
        </div>

        {/* YouTube iframe */}
        <div className="gtm-video-container relative aspect-video w-full">
          <iframe
            src={youtubeUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="gtm-video-frame w-full h-full"
          />
        </div>
      </div>
    </div>,
    document.body
  )
}