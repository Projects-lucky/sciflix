/**
 * Filters — Barrel Exports
 * Single import point for all filter components.
 *
 * Usage:
 * import { FilterBar, GenreFilter, SortFilter } from '@/components/filters';
 */

// ============================================
// PRIMARY / SEARCH FILTERS
// ============================================

export { LanguageFilter } from './language-filter';
export type {
  LanguageFilterProps,
  LanguageFilterVariant,
} from './language-filter';

export { TypeFilter } from './type-filter';
export type { TypeFilterProps } from './type-filter';

export { AdultFilter } from './adult-filter';
export type {
  AdultFilterProps,
  AdultFilterVariant,
} from './adult-filter';

export { ResetFiltersButton } from './reset-filters-button';
export type {
  ResetFiltersButtonProps,
  ResetVariant,
} from './reset-filters-button';

// ============================================
// DISCOVER FILTERS
// ============================================

export { GenreFilter } from './genre-filter';
export type { GenreFilterProps } from './genre-filter';

export { SortFilter } from './sort-filter';
export type { SortFilterProps } from './sort-filter';

export { OriginCountryFilter } from './origin-country-filter';
export type { OriginCountryFilterProps } from './origin-country-filter';

export { OriginalLanguageFilter } from './original-language-filter';
export type { OriginalLanguageFilterProps } from './original-language-filter';

export { DateRangeFilter } from './date-range-filter';
export type { DateRangeFilterProps } from './date-range-filter';

export { VoteAverageFilter } from './vote-average-filter';
export type { VoteAverageFilterProps } from './vote-average-filter';

export { NetworkFilter } from './network-filter';
export type { NetworkFilterProps } from './network-filter';

export { CertificationFilter } from './certification-filter';
export type { CertificationFilterProps } from './certification-filter';

export { YearFilter } from './year-filter';
export type { YearFilterProps } from './year-filter';
// ============================================
// COMPOSITE / WRAPPERS
// ============================================

export { FilterBar } from './filter-bar';
export type { FilterBarProps } from './filter-bar';

export { FilterDialog } from './filter-dialog';
export type { FilterDialogProps } from './filter-dialog';

// ============================================
// HOOKS
// ============================================

export { useActiveFilterCount } from './use-active-filter-count';