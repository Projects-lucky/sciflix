/**
 * Search Filter Container Component
 * 
 * Wraps the search filter bar with URL state management using nuqs.
 * Handles debounced URL updates and pending states.
 * Resets page to 1 when any filter changes.
 */

'use client'

import * as React from 'react'
import { useQueryStates, parseAsString, parseAsInteger, debounce } from 'nuqs'
import { SearchFilterBar } from './SearchFilterBar'
import { FilterOption } from '../types'

interface SearchFilterContainerProps {
  typeOptions: FilterOption[]
  yearOptions: FilterOption[]
  languageOptions: FilterOption[]
  includeAdultOptions: FilterOption[]
}

/**
 * SearchFilterContainer Component
 * 
 * @param typeOptions - Available search type options
 * @param yearOptions - Available year options
 * @param languageOptions - Available language options
 * @param includeAdultOptions - Adult content options
 */
export function SearchFilterContainer({
  typeOptions,
  yearOptions,
  languageOptions,
  includeAdultOptions,
}: SearchFilterContainerProps) {
  const [isPending, startTransition] = React.useTransition()

  // Manage search filters as URL query parameters
  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      type: parseAsString.withDefault('multi'),
      year: parseAsString.withDefault(''),
      language: parseAsString.withDefault(''),
      includeAdult: parseAsString.withDefault('false'),
      page: parseAsInteger.withDefault(1),
    },
    {
      startTransition,
      shallow: false,
      limitUrlUpdates: debounce(400),
    }
  )

  /**
   * Updates a filter value and resets pagination
   * 
   * @param key - Filter key to update
   * @param value - New filter value
   */
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page on filter change
    }))
  }

  /**
   * Resets all filters to default values
   */
  const handleReset = () => {
    setFilters({
      q: '',
      type: 'multi',
      year: '',
      language: '',
      includeAdult: 'false',
      page: 1,
    })
  }

  return (
    <div className="w-full">
      <SearchFilterBar
        filters={filters}
        typeOptions={typeOptions}
        yearOptions={yearOptions}
        languageOptions={languageOptions}
        includeAdultOptions={includeAdultOptions}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        isPending={isPending}
      />
    </div>
  )
}