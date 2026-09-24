/**
 * DateRangeFilter Component
 * Filters content by a date range (from / to)
 * Movie: releaseDateGte / releaseDateLte
 * TV:    firstAirDateGte / firstAirDateLte
 *
 * Uses native <input type="date"> — zero dependencies
 */

'use client';

import { useQueryStates } from 'nuqs';
import {
  discoverParsers,
  DISCOVER_OPTIONS,
} from '@/lib/search/nuqs-parsers';
import { Input } from '@/components/ui/input';
import { type MediaType } from '@/lib/config/filters.config';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface DateRangeFilterProps {
  type: MediaType;
  className?: string;
  label?: string;
}

// ============================================
// COMPONENT
// ============================================

export function DateRangeFilter({
  type,
  className,
  label = 'Date',
}: DateRangeFilterProps) {
  const [filters, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS
  );

  // Pick the right param names by media type
  const fromKey =
    type === 'movie' ? 'releaseDateGte' : 'firstAirDateGte';
  const toKey =
    type === 'movie' ? 'releaseDateLte' : 'firstAirDateLte';

  const fromValue = filters[fromKey] ?? '';
  const toValue = filters[toKey] ?? '';

  const handleFromChange = (value: string) => {
    setFilters({
      [fromKey]: value || null,
      page: 1,
    });
  };

  const handleToChange = (value: string) => {
    setFilters({
      [toKey]: value || null,
      page: 1,
    });
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label
        className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap"
      >
        {label}
      </label>

      <div className="flex items-center gap-1.5">
        <Input
          type="date"
          value={fromValue}
          onChange={(e) => handleFromChange(e.target.value)}
          aria-label={`${type} from date`}
          className="h-9 w-36 bg-neutral-800 border-neutral-700 text-white text-sm scheme:dark]"
        />
        <span className="text-muted-foreground text-xs">to</span>
        <Input
          type="date"
          value={toValue}
          onChange={(e) => handleToChange(e.target.value)}
          aria-label={`${type} to date`}
          className="h-9 w-36 bg-neutral-800 border-neutral-700 text-white text-sm scheme:dark]"
        />
      </div>
    </div>
  );
}