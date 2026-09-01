/**
 * Filter Hooks
 * 
 * React hooks for managing movie and TV show filters with React Query.
 * Provides filter state management, pagination reset on filter change,
 * and cached data fetching with keepPreviousData for smooth transitions.
 */

import { useState, useCallback } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { moviesService, tvService } from '@/services'
import type { MovieFilters, TVFilters } from '@/types'

/**
 * Movie Filters Hook
 * 
 * @param initialFilters - Initial filter values
 * @returns Filter state, update functions, and query results
 */
export function useMovieFilters(initialFilters: MovieFilters = {}) {
  const [filters, setFilters] = useState<MovieFilters>({
    page: 1,
    sort_by: 'popularity.desc',
    ...initialFilters,
  })

  /**
   * Updates a single filter and resets page to 1
   * 
   * @param key - Filter key to update
   * @param value - New filter value
   */
  const updateFilter = useCallback((key: keyof MovieFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }, [])

  /**
   * Resets all filters to default values
   */
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      sort_by: 'popularity.desc',
    })
  }, [])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['movies', 'discover', filters],
    queryFn: () => moviesService.getDiscover(filters),
    placeholderData: keepPreviousData
  })

  return {
    filters,
    updateFilter,
    resetFilters,
    movies: data?.results || [],
    totalPages: data?.total_pages || 0,
    totalResults: data?.total_results || 0,
    isLoading,
    error,
    refetch,
  }
}

/**
 * TV Filters Hook
 * 
 * @param initialFilters - Initial filter values
 * @returns Filter state, update functions, and query results
 */
export function useTVFilters(initialFilters: TVFilters = {}) {
  const [filters, setFilters] = useState<TVFilters>({
    page: 1,
    sort_by: 'popularity.desc',
    ...initialFilters,
  })

  /**
   * Updates a single filter and resets page to 1
   * 
   * @param key - Filter key to update
   * @param value - New filter value
   */
  const updateFilter = useCallback((key: keyof TVFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }, [])

  /**
   * Resets all filters to default values
   */
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      sort_by: 'popularity.desc',
    })
  }, [])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tv', 'discover', filters],
    queryFn: () => tvService.getDiscover(filters),
    placeholderData: keepPreviousData,
  })

  return {
    filters,
    updateFilter,
    resetFilters,
    tvShows: data?.results || [],
    totalPages: data?.total_pages || 0,
    totalResults: data?.total_results || 0,
    isLoading,
    error,
    refetch,
  }
}