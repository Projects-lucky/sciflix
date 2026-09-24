/**
 * ResetFiltersButton Component
 * Clears all filter params for a given context.
 *
 * Two variants:
 * - 'search'   → resets searchParsers
 * - 'discover' → resets discoverParsers
 *
 * By default, hides itself when no filters are active.
 * Use forceShow to always render (e.g., inside a dialog footer).
 */

'use client';

import { useQueryStates } from 'nuqs';
import {
  searchParsers,
  discoverParsers,
  NUQS_OPTIONS,
  DISCOVER_OPTIONS,
} from '@/lib/search/nuqs-parsers';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export type ResetVariant = 'search' | 'discover';

export interface ResetFiltersButtonProps {
  variant?: ResetVariant;
  /** Always render, even if no filters are active */
  forceShow?: boolean;
  className?: string;
  label?: string;
}

// ============================================
// COMPONENT
// ============================================

export function ResetFiltersButton({
  variant = 'search',
  forceShow = false,
  className,
  label = 'Reset',
}: ResetFiltersButtonProps) {
  return variant === 'discover' ? (
    <DiscoverReset className={className} label={label} forceShow={forceShow} />
  ) : (
    <SearchReset className={className} label={label} forceShow={forceShow} />
  );
}

// ============================================
// SEARCH RESET
// ============================================

function SearchReset({
  className,
  label,
  forceShow,
}: {
  className?: string;
  label: string;
  forceShow: boolean;
}) {
  const [filters, setFilters] = useQueryStates(searchParsers, NUQS_OPTIONS);

  const hasActiveFilters =
    filters.q !== '' ||
    filters.type !== 'multi' ||
    filters.language !== 'en-US' ||
    filters.adult !== false ||
    filters.page !== 1;

  if (!hasActiveFilters && !forceShow) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setFilters(null)}
      disabled={!hasActiveFilters}
      className={cn(
        'text-gray-400  hover:text-white hover:bg-neutral-800 gap-2',
        className
      )}
    >
      <RotateCcw className="w-3.5 h-3.5" />
      {label}
    </Button>
  );
}

// ============================================
// DISCOVER RESET — checks ALL fields
// ============================================

function DiscoverReset({
  className,
  label,
  forceShow,
}: {
  className?: string;
  label: string;
  forceShow: boolean;
}) {
  const [filters, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS
  );

  const hasActiveFilters =
    // Core
    Boolean(filters.withGenres) ||
    (filters.sortBy !== undefined && filters.sortBy !== 'popularity.desc') ||
    (filters.language !== undefined && filters.language !== 'en-US') ||
    filters.adult === true ||
    (filters.page !== undefined && filters.page !== 1) ||
    (typeof filters.minVoteCount === 'number' && filters.minVoteCount > 0) ||
    Boolean(filters.runtime) ||
    // Country + Original Language
    Boolean(filters.withOriginCountry) ||
    Boolean(filters.withOriginalLanguage) ||
    // Date ranges
    Boolean(filters.releaseDateGte) ||
    Boolean(filters.releaseDateLte) ||
    Boolean(filters.firstAirDateGte) ||
    Boolean(filters.firstAirDateLte) ||
    typeof filters.year === 'number' ||
    typeof filters.firstAirDateYear === 'number' ||
    // Vote average
    typeof filters.voteAverageGte === 'number' ||
    typeof filters.voteAverageLte === 'number' ||
    // Network
    typeof filters.withNetworks === 'number' ||
    // Certification
    Boolean(filters.certification);

  if (!hasActiveFilters && !forceShow) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setFilters(null)}
      disabled={!hasActiveFilters}
      className={cn(
        'text-gray-400 hover:text-white hover:bg-neutral-800 gap-2',
        className
      )}
    >
      <RotateCcw className="w-3.5 h-3.5" />
      {label}
    </Button>
  );
}