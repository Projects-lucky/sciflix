/**
 * People Client Component
 * 
 * Client-side component that handles infinite scrolling for popular people.
 * Uses InfiniteScrollProvider to manage paginated data fetching.
 * Wrapped with ErrorBoundary for graceful error handling.
 */

'use client'

import { personService } from '@/services/tmdb/person.service'
import { InfiniteScrollProvider } from '@/providers/InfiniteScrollProvider'
import { InfiniteScrollWrapper } from '@/components/shared/InfiniteScrollWrapper'
import { PersonGrid } from '@/components/person/PersonGrid'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Person } from '@/types/person'

interface PeopleClientProps {
  initialItems: Person[]
  initialTotalPages: number
}

/**
 * PeopleClient Component
 * 
 * @param initialItems - Pre-fetched people data for first page
 * @param initialTotalPages - Total number of pages available
 */
export function PeopleClient({
  initialItems,
  initialTotalPages,
}: PeopleClientProps) {
  /**
   * Fetches people for a specific page
   * 
   * @param page - Page number to fetch
   * @returns Formatted people data with pagination info
   */
  const fetchPeople = async (page: number) => {
    const response = await personService.getPopular(page)
    return {
      results: response.results,
      total_pages: response.total_pages,
    }
  }

  return (
    <ErrorBoundary>
      <InfiniteScrollProvider
        queryKey={['people', 'infinite']}
        fetchFn={fetchPeople}
        initialData={initialItems}
        initialTotalPages={initialTotalPages}
      >
        <InfiniteScrollWrapper emptyMessage="No people found">
          {(items) => (
            <PersonGrid people={items} />
          )}
        </InfiniteScrollWrapper>
      </InfiniteScrollProvider>
    </ErrorBoundary>
  )
}