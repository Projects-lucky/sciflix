/**
 * Person Grid Component
 * 
 * Displays a grid of person cards with loading, error, and empty states.
 * Handles skeleton loading, error display with retry, and empty state.
 * Renders PersonCard for each person in the array.
 */

'use client'
import { PersonCard } from './PersonCard'
import { Person } from '@/types/person'
import { AlertTriangle, Users } from 'lucide-react'

interface PersonGridProps {
  people: Person[]
  loading?: boolean
  error?: Error | null
}

/**
 * PersonGrid Component
 * 
 * @param people - Array of person objects to display
 * @param loading - Whether data is currently loading
 * @param error - Error object if fetch failed
 * @returns Rendered person grid with appropriate state
 */
export function PersonGrid({ people, loading, error }: PersonGridProps) {
  // Loading skeleton state
  if (loading) {
    return (
      <div 
        className="pgrid gap-x-4 gap-y-8"
        aria-busy="true"
        aria-live="polite"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse text-center p-2">
            <div className="w-full aspect-2/3 max-w-60 mx-auto bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            <div className="mt-3 space-y-2 px-2">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 mx-auto" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2 mx-auto" />
              <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 p-6 text-center border border-red-100 dark:border-red-950/30 bg-red-50/50 dark:bg-red-950/10 rounded-2xl max-w-md mx-auto my-4">
        <div className="p-3 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          Failed to load content
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          {error.message || "An unexpected error occurred while fetching profiles."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors shadow-sm"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Empty state
  if (!people || people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-87.5 p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl my-4">
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600 rounded-full mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-1">
          No matches found
        </h3>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-xs">
          We couldn't find any people matching this selection right now.
        </p>
      </div>
    )
  }

  // Render person cards
  return (
    <div className="pgrid gap-x-4 gap-y-8">
      {people.map((person) => (
        <PersonCard 
          key={person.id}
          person={person}
        />
      ))}
    </div>
  )
}