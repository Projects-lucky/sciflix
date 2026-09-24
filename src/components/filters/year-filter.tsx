/**
 * YearFilter Component
 * Single year input for movie (year) or TV (firstAirDateYear)
 *
 * Keeps local input state while typing; commits to URL only when:
 *   - input is empty (clears param)
 *   - input is a valid 4-digit year (1900–2100)
 */

'use client';

import { useEffect, useState } from 'react';
import { useQueryStates } from 'nuqs';
import { discoverParsers, DISCOVER_OPTIONS } from '@/lib/search/nuqs-parsers';
import { Input } from '@/components/ui/input';
import type { MediaType } from '@/lib/config/filters.config';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface YearFilterProps {
  type: MediaType;
  className?: string;
  label?: string;
}

// ============================================
// COMPONENT
// ============================================

export function YearFilter({
  type,
  className,
  label = 'Year',
}: YearFilterProps) {
  const [filters, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS
  );

  const key = type === 'movie' ? 'year' : 'firstAirDateYear';
  const urlValue = filters[key];
  const urlValueString =
    typeof urlValue === 'number' ? String(urlValue) : '';

  // Local input mirrors typing — not synced to URL until valid
  const [input, setInput] = useState(urlValueString);

  // Sync local state when URL changes externally (reset, back/forward)
  useEffect(() => {
    setInput(urlValueString);
  }, [urlValueString]);

  const handleChange = (value: string) => {
    // Keep only digits, cap at 4 chars
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setInput(cleaned);

    // Commit only when valid
    if (cleaned === '') {
      setFilters({ [key]: null, page: 1 });
      return;
    }

    if (cleaned.length === 4) {
      const parsed = Number(cleaned);
      if (parsed >= 1900 && parsed <= 2100) {
        setFilters({ [key]: parsed, page: 1 });
      }
    }
    // Partial 1–3 digit input: keep in local state only, no URL write
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 md:flex-row md:items-center md:gap-2',
        className
      )}
    >
      <label
        htmlFor={`year-filter-${type}`}
        className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap"
      >
        {label}
      </label>
      <Input
        id={`year-filter-${type}`}
        type="text"
        inputMode="numeric"
        placeholder="e.g. 2024"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        maxLength={4}
        className="w-full md:w-32 h-9 bg-neutral-800 border-neutral-700 text-white text-sm scheme:dark"
      />
    </div>
  );
}