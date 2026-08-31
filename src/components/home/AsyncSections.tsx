/**
 * Async Sections for Home Page
 * 
 * Isolated async components for fetching and rendering home page sections.
 * Each section handles its own data fetching and error states independently.
 * Used with Suspense boundaries for progressive rendering.
 */

import { trendingService, personService } from "@/services"
import { transformTrendingResponse } from "@/transformers"
import { HeroCarousel, GenericCarousel, PersonCard } from "@/components"

/**
 * Hero Section Component
 * 
 * Fetches trending content for the hero carousel.
 * Displays fallback UI if data fetching fails.
 * 
 * @returns Rendered hero carousel or error message
 */
export async function HeroSection() {
  try {
    const trendingAll = await trendingService.getTrending("all", "week")
    const heroData = transformTrendingResponse(trendingAll, 8)
    
    return <HeroCarousel items={heroData.results || []} />
  } catch (error) {
    console.error("Failed to load Hero TMDB data:", error)
    return <div className="h-40 flex items-center justify-center text-gray-500 bg-mist-900 rounded-xl">Unable to load featured titles.</div>
  }
}

/**
 * Celebrities Section Component
 * 
 * Fetches popular people for the trending celebrities carousel.
 * Returns null on error to gracefully hide the section.
 * 
 * @returns Rendered celebrities carousel or null
 */
export async function CelebritiesSection() {
  try {
    const people = await personService.getPopular()
    const peopleData = transformTrendingResponse(people, 12)
    
    return (
      <section>
        <h2 className="text-2xl font-bold px-4 mb-4">Trending Celebrities</h2>
        <GenericCarousel
          items={peopleData.results || []}
          renderKey={(item) => item.id}
          renderItem={(item) => <PersonCard person={item.raw} />}
        />
      </section>
    )
  } catch (error) {
    console.error("Failed to load Celebrities TMDB data:", error)
    return null
  }
}