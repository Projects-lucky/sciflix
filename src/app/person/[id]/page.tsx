/**
 * Person Detail Page
 * 
 * Server component that displays detailed information about a person (actor/crew).
 * Fetches person details and combined credits (cast and crew) in parallel.
 * Supports static generation for the first 10 popular people.
 */

import { personService } from '@/services/tmdb/person.service'
import { notFound } from 'next/navigation'
import { PersonDetail } from '@/components/person/PersonDetail'

interface PersonDetailPageProps {
  params: Promise<{ id: string }>
}

/**
 * Generates static paths for the first 10 popular people.
 * Pre-renders these pages at build time for improved performance.
 * 
 * @returns Array of parameter objects containing person IDs
 */
export async function generateStaticParams() {
  const popular = await personService.getPopular(1)
  return popular.results.slice(0, 10).map((person) => ({
    id: String(person.id),
  }))
}

/**
 * Generates metadata for SEO.
 * 
 * @param params - Contains the person ID from the URL
 * @returns Page metadata including title and description
 */
export async function generateMetadata({ params }: PersonDetailPageProps) {
  const { id } = await params
  const person = await personService.getDetails(parseInt(id))

  return {
    title: `${person.name} - Person Details`,
    description: person.biography?.slice(0, 160) || 'Person details',
  }
}

/**
 * Person Detail Page Component
 * 
 * Fetches person details and combined credits concurrently.
 * Returns 404 if the person is not found or the ID is invalid.
 */
export default async function PersonDetailPage({ params }: PersonDetailPageProps) {
  const { id } = await params
  const personId = parseInt(id)

  if (isNaN(personId)) {
    notFound()
  }

  // Fetch person details and credits in parallel
  const [person, credits] = await Promise.all([
    personService.getDetails(personId),
    personService.getCombinedCredits(personId),
  ])

  if (!person || !person.id) {
    notFound()
  }

  // Map person data to component props
  const personData = {
    id: person.id,
    name: person.name,
    biography: person.biography,
    birthday: person.birthday,
    deathday: person.deathday,
    placeOfBirth: person.place_of_birth,
    profile: person.profile_path,
    department: person.known_for_department,
    popularity: person.popularity,
  }

  // Combine cast and crew credits into a single filmography list
  const filmography = [
    ...credits.cast.map((c: any) => ({
      id: c.id,
      title: c.title || c.name,
      poster: c.poster_path,
      character: c.character,
      year: c.release_date?.split('-')[0] || c.first_air_date?.split('-')[0] || 'N/A',
      mediaType: c.media_type,
    })),
    ...credits.crew.map((c: any) => ({
      id: c.id,
      title: c.title || c.name,
      poster: c.poster_path,
      job: c.job,
      year: c.release_date?.split('-')[0] || c.first_air_date?.split('-')[0] || 'N/A',
      mediaType: c.media_type,
    })),
  ]

  return (
    <section className="person-detail-page min-h-screen bg-gray-50 dark:bg-gray-950">
      <PersonDetail person={personData} filmography={filmography} />
    </section>
  )
}