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

export type {
  AdultFilterProps,
  AdultFilterVariant,
} from "./adult-filter";
export { AdultFilter } from "./adult-filter";
export type {
  LanguageFilterProps,
  LanguageFilterVariant,
} from "./language-filter";
export { LanguageFilter } from "./language-filter";
export type {
  ResetFiltersButtonProps,
  ResetVariant,
} from "./reset-filters-button";
export { ResetFiltersButton } from "./reset-filters-button";
export type { TypeFilterProps } from "./type-filter";
export { TypeFilter } from "./type-filter";

// ============================================
// DISCOVER FILTERS
// ============================================

export type { CertificationFilterProps } from "./certification-filter";
export { CertificationFilter } from "./certification-filter";
export type { DateRangeFilterProps } from "./date-range-filter";
export { DateRangeFilter } from "./date-range-filter";
export type { GenreFilterProps } from "./genre-filter";
export { GenreFilter } from "./genre-filter";
export type { NetworkFilterProps } from "./network-filter";
export { NetworkFilter } from "./network-filter";
export type { OriginCountryFilterProps } from "./origin-country-filter";
export { OriginCountryFilter } from "./origin-country-filter";
export type { OriginalLanguageFilterProps } from "./original-language-filter";
export { OriginalLanguageFilter } from "./original-language-filter";
export type { SortFilterProps } from "./sort-filter";
export { SortFilter } from "./sort-filter";
export type { VoteAverageFilterProps } from "./vote-average-filter";
export { VoteAverageFilter } from "./vote-average-filter";
export type { YearFilterProps } from "./year-filter";
export { YearFilter } from "./year-filter";

// ============================================
// COMPOSITE / WRAPPERS
// ============================================

export type { FilterBarProps } from "./filter-bar";
export { FilterBar } from "./filter-bar";
export type { FilterDialogProps } from "./filter-dialog";
export { FilterDialog } from "./filter-dialog";

// ============================================
// HOOKS
// ============================================

export { useActiveFilterCount } from "./use-active-filter-count";
