/**
 * Filter Container Component
 * 
 * Manages filter state with URL synchronization using nuqs.
 * Handles genre arrays, pagination reset on filter change, and dirty state tracking.
 * Wraps FilterBar with pending state visual feedback.
 */

'use client'

import { useQueryStates, parseAsString, parseAsInteger, parseAsArrayOf } from 'nuqs'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { FilterBar } from './FilterBar'
import { FilterOption, FilterState } from './types'

interface FilterContainerProps {
  type: 'movie' | 'tv'
  genreOptions: FilterOption[]
  yearOptions: FilterOption[]
  ratingOptions: FilterOption[]
  sortOptions: FilterOption[]
  languageOptions: FilterOption[]
  countryOptions: FilterOption[]
  runtimeOptions: FilterOption[]
  includeAdultOptions: FilterOption[]
  basePath: string
}

/**
 * FilterContainer Component
 * 
 * @param type - Media type (movie or tv)
 * @param genreOptions - Available genre options
 * @param yearOptions - Available year options
 * @param ratingOptions - Available rating options
 * @param sortOptions - Available sort options
 * @param languageOptions - Available language options
 * @param countryOptions - Available country options
 * @param runtimeOptions - Available runtime options
 * @param includeAdultOptions - Adult content options
 * @param basePath - Base path for reset navigation
 */
export function FilterContainer({
  type,
  genreOptions,
  yearOptions,
  ratingOptions,
  sortOptions,
  languageOptions,
  countryOptions,
  runtimeOptions,
  includeAdultOptions,
  basePath,
}: FilterContainerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Manage URL query parameters with nuqs
  const [urlFilters, setUrlFilters] = useQueryStates({
    genre: parseAsArrayOf(parseAsString).withDefault([]),
    year: parseAsString.withDefault(''),
    rating: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('popularity.desc'),
    page: parseAsInteger.withDefault(1),
    language: parseAsString.withDefault(''),
    country: parseAsString.withDefault(''),
    runtime: parseAsString.withDefault(''),
    includeAdult: parseAsString.withDefault('false'),
  }, {
    history: 'push',
    shallow: false, 
    startTransition
  })

  // Determine if any filters have been modified from defaults
  const isChanged = 
    urlFilters.genre.length > 0 ||
    urlFilters.year !== '' ||
    urlFilters.rating !== '' ||
    urlFilters.sort !== 'popularity.desc' ||
    urlFilters.language !== '' ||
    urlFilters.country !== '' ||
    urlFilters.runtime !== '' ||
    urlFilters.includeAdult !== 'false'

  /**
   * Handles filter value changes
   * Resets to page 1 and normalizes empty values to null
   */
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    // Clear genre array from URL when empty
    if (key === 'genre' && Array.isArray(value) && value.length === 0) {
      setUrlFilters({
        genre: null,
        page: 1,
      })
      return
    }

    setUrlFilters({
      [key]: value === '' ? null : value,
      page: 1,
    })
  }

  /**
   * Resets all filters to default values
   * Navigates to base path without query parameters
   */
  const handleReset = () => {
    setUrlFilters(null)
    router.push(basePath)
  }

  // Convert genre array to string for child component compatibility
  const adaptedFilters: FilterState = {
    ...urlFilters,
    genre: urlFilters.genre.join(','), 
  }

  return (
    <div className={isPending ? "opacity-60 pointer-events-none transition-opacity duration-200" : "transition-opacity duration-200"}>
      <FilterBar
        filters={adaptedFilters}
        genreOptions={genreOptions}
        yearOptions={yearOptions}
        ratingOptions={ratingOptions}
        sortOptions={sortOptions}
        languageOptions={languageOptions}
        countryOptions={countryOptions}
        runtimeOptions={runtimeOptions}
        includeAdultOptions={includeAdultOptions}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        isChanged={isChanged}
        type={type}
      />
    </div>
  )
}