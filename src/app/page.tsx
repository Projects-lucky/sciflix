/**
 * Home Page
 * 
 * Server component that renders the application homepage.
 * Uses Suspense boundaries for progressive rendering of heavy components.
 * Revalidates every 3600 seconds (1 hour) for updated content.
 */

import { Suspense } from 'react'
import { GenreShowcase } from "@/components"
import { HeroSection, CelebritiesSection } from '@/components/home/AsyncSections'

export const dynamic = 'force-dynamic'

export const revalidate = 3600

/**
 * Home Page Component
 * 
 * Streams content progressively:
 * 1. Hero section loads immediately
 * 2. Celebrities section loads independently
 * 3. Genre showcase loads last with heavy content
 */
export default function HomePage() {
  return (
    <main className="flex flex-col gap-12">
      {/* Hero section - streams instantly */}
      <Suspense fallback={<div className="h-120 w-full animate-pulse bg-mist-800 rounded-md" />}>
        <HeroSection />
      </Suspense>

      {/* Celebrities section - loads independently */}
      <Suspense fallback={
        <div className="px-4 flex flex-col gap-4">
          <div className="h-8 w-48 bg-mist-800 animate-pulse rounded" />
          <div className="h-64 w-full animate-pulse bg-mist-900 rounded-xl" />
        </div>
      }>
        <CelebritiesSection />
      </Suspense>

      {/* Genre showcase - loads when ready */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-mist-900 rounded-xl mx-4" />}>
        <GenreShowcase type="all" maxRows={4} />
      </Suspense>
    </main>
  )
}