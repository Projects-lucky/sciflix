'use client';

import { useQueryStates } from 'nuqs';
import {
  searchParsers,
  discoverParsers,
  NUQS_OPTIONS,
  DISCOVER_OPTIONS,
} from '@/lib/search/nuqs-parsers';
import { LANGUAGE_OPTIONS } from '@/lib/config/filters.config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type LanguageFilterVariant = 'search' | 'discover';

export interface LanguageFilterProps {
  variant?: LanguageFilterVariant;
  className?: string;
  label?: string;
}

export function LanguageFilter({
  variant = 'search',
  className,
  label = 'Language',
}: LanguageFilterProps) {
  return variant === 'discover' ? (
    <DiscoverLanguage className={className} label={label} />
  ) : (
    <SearchLanguage className={className} label={label} />
  );
}

// ============================================
// SEARCH VARIANT
// ============================================

function SearchLanguage({
  className,
  label,
}: {
  className?: string;
  label: string;
}) {
  const [{ language }, setFilters] = useQueryStates(
    searchParsers,
    NUQS_OPTIONS
  );

  return (
    <LanguageSelect
      id="language-filter-search"
      language={language}
      label={label}
      className={className}
      onChange={(value) => setFilters({ language: value, page: 1 })}
    />
  );
}

// ============================================
// DISCOVER VARIANT
// ============================================

function DiscoverLanguage({
  className,
  label,
}: {
  className?: string;
  label: string;
}) {
  const [{ language }, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS
  );

  return (
    <LanguageSelect
      id="language-filter-discover"
      language={language}
      label={label}
      className={className}
      onChange={(value) => setFilters({ language: value, page: 1 })}
    />
  );
}

// ============================================
// SHARED SELECT
// ============================================

interface LanguageSelectProps {
  id: string;
  language: string;
  label: string;
  className?: string;
  onChange: (value: string) => void;
}

function LanguageSelect({
  id,
  language,
  label,
  className,
  onChange,
}: LanguageSelectProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label
        htmlFor={id}
        className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap"
      >
        {label}
      </label>
      <Select value={language} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="w-36 h-9 bg-neutral-800 border-neutral-700 text-white text-sm"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGE_OPTIONS.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}