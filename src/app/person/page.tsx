/**
 * People Page
 * 
 * Server component that displays a list of popular people with infinite scrolling.
 * Pre-fetches initial data and uses ISR with 1-hour revalidation.
 */

import { personService } from '@/services/tmdb/person.service'
import { PeopleClient } from './PeopleClient'

export const dynamic = 'force-dynamic'

export const revalidate = 3600

export const metadata = {
  title: 'Popular People - MovieApp',
  description: 'Discover popular actors, directors, and celebrities.',
}

interface PeoplePageProps {
  searchParams: Promise<{
    page?: string
  }>
}

/**
 * People Page Component
 * 
 * @param searchParams - URL query parameters for pagination
 * @returns Rendered people page with infinite scrolling
 */
export default async function PeoplePage({ searchParams }: PeoplePageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  
  // Fetch first page of popular people
  const initialData = await personService.getPopular(page)

  return (
    <section className="person-page container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Popular People</h1>
      
      <PeopleClient
        initialItems={initialData.results}
        initialTotalPages={initialData.total_pages}
      />
    </section>
  )
}