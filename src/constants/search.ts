/**
 * Search Constants
 * 
 * Configuration for search functionality including type options and default filters.
 * Used by the search page and search components.
 */

import { FilterOption } from '@/components/filters/types'

// Search Types (TMDB endpoints)
export const SEARCH_TYPE_OPTIONS: FilterOption[] = [
  { value: 'multi', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
  { value: 'person', label: 'People' },
]

// Default Search Filters
export const DEFAULT_SEARCH_FILTERS = {
  type: 'multi',
  includeAdult: false,
  page: 1,
}