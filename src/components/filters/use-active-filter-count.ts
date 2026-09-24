/**
 * useActiveFilterCount Hook
 * Counts non-default filter values from the URL.
 *
 * Returns the number of actively applied filters (0 if all defaults).
 * Used to display a badge on the "More Filters" button.
 */

'use client';

import { useQueryStates } from 'nuqs';
import { discoverParsers } from '@/lib/search/nuqs-parsers';

// ============================================
// DEFAULTS (must match parser defaults)
// ============================================

const DEFAULTS = {
  sortBy: 'popularity.desc',
  language: 'en-US',
  adult: false,
  page: 1,
  minVoteCount: 0,
} as const;

// ============================================
// HOOK
// ============================================

export function useActiveFilterCount(): number {
  const [filters] = useQueryStates(discoverParsers);

  let count = 0;

  // Core filters
  if (filters.withGenres) count++;
  if (filters.sortBy && filters.sortBy !== DEFAULTS.sortBy) count++;
  if (filters.language && filters.language !== DEFAULTS.language) count++;
  if (filters.adult === true) count++;
  if (typeof filters.minVoteCount === 'number' && filters.minVoteCount > DEFAULTS.minVoteCount) count++;
  if (filters.runtime) count++;

  // Country + Original Language
  if (filters.withOriginCountry) count++;
  if (filters.withOriginalLanguage) count++;

  // Date ranges
  if (filters.releaseDateGte || filters.releaseDateLte) count++;
  if (filters.firstAirDateGte || filters.firstAirDateLte) count++;

  // Vote average
  if (
    typeof filters.voteAverageGte === 'number' ||
    typeof filters.voteAverageLte === 'number'
  ) {
    count++;
  }

  // Network (TV only)
  if (typeof filters.withNetworks === 'number') count++;

  // Certification (movie only)
  if (filters.certification) count++;

  return count;
}