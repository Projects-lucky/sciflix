/**
 * Filter Types
 * 
 * Shared type definitions for filter components.
 * Includes filter options, state, and configuration interfaces.
 */

export interface FilterOption {
  value: string | number
  label: string
}

export interface FilterState {
  genre: string
  year: string
  rating: string
  sort: string
  page: number
  language: string
  country: string
  runtime: string
  includeAdult: string
}

export interface FilterConfig {
  type: 'movie' | 'tv'
  initialValues?: Partial<FilterState>
  genreOptions: FilterOption[]
  yearOptions: FilterOption[]
  ratingOptions: FilterOption[]
  sortOptions: FilterOption[]
  languageOptions: FilterOption[]
  countryOptions: FilterOption[]
  runtimeOptions: FilterOption[]
  includeAdultOptions: FilterOption[]
  onApply: (filters: FilterState) => void
}

export interface FilterProps {
  value: string
  options: FilterOption[]
  placeholder?: string
  onChange: (value: string) => void
  label?: string
}

export interface SearchFilterState {
  query: string
  type: string
  year: string
  language: string
  includeAdult: string
  page: number
}

export interface SearchFilterConfig {
  initialValues?: Partial<SearchFilterState>
  typeOptions: FilterOption[]
  yearOptions: FilterOption[]
  languageOptions: FilterOption[]
  includeAdultOptions: FilterOption[]
  onApply: (filters: SearchFilterState) => void
  onReset: () => void
}