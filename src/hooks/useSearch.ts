/**
 * Search Hooks
 * 
 * React Query hooks for search functionality across movies, TV shows, and people.
 * Includes debounced search to reduce API calls.
 */

import { useQuery } from '@tanstack/react-query'
import { searchService } from '@/services'
import { useState, useEffect } from 'react'

/**
 * useSearch Hook - Multi-search
 * 
 * @param query - Search query string
 * @param page - Page number for pagination
 * @returns React Query result with debounced search
 */
export function useSearch(query: string, page: number = 1) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  return useQuery({
    queryKey: ['search', debouncedQuery, page],
    queryFn: () => searchService.searchMulti(debouncedQuery, page),
    enabled: debouncedQuery.length > 0,
  })
}

/**
 * useSearchMovies Hook
 * 
 * @param query - Search query string
 * @param page - Page number for pagination
 * @returns React Query result for movie search
 */
export function useSearchMovies(query: string, page: number = 1) {
  return useQuery({
    queryKey: ['search', 'movies', query, page],
    queryFn: () => searchService.searchMovies(query, page),
    enabled: query.length > 0,
  })
}

/**
 * useSearchTV Hook
 * 
 * @param query - Search query string
 * @param page - Page number for pagination
 * @returns React Query result for TV show search
 */
export function useSearchTV(query: string, page: number = 1) {
  return useQuery({
    queryKey: ['search', 'tv', query, page],
    queryFn: () => searchService.searchTV(query, page),
    enabled: query.length > 0,
  })
}

/**
 * useSearchPeople Hook
 * 
 * @param query - Search query string
 * @param page - Page number for pagination
 * @returns React Query result for people search
 */
export function useSearchPeople(query: string, page: number = 1) {
  return useQuery({
    queryKey: ['search', 'people', query, page],
    queryFn: () => searchService.searchPerson(query, page),
    enabled: query.length > 0,
  })
}