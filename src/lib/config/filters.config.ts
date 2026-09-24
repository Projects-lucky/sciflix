/**
 * Filter Configuration - Single Source of Truth
 * All filter options centralized here
 * Used by search filters, discover filters, and future features
 */

// ============================================
// LANGUAGE FILTER OPTIONS
// ============================================

export const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English' },
  { value: 'es-ES', label: 'Español' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'it-IT', label: 'Italiano' },
  { value: 'pt-BR', label: 'Português' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'ko-KR', label: '한국어' },
  { value: 'zh-CN', label: '中文' },
  { value: 'hi-IN', label: 'हिन्दी' },
  { value: 'ru-RU', label: 'Русский' },
  { value: 'ar-SA', label: 'العربية' },
] as const;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]['value'];

// ============================================
// SEARCH TYPE FILTER OPTIONS
// TMDB search endpoints: /search/multi, /search/movie, /search/tv, /search/person
// ============================================

export const SEARCH_TYPE_OPTIONS = [
  { value: 'multi', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
  { value: 'person', label: 'People' },
] as const;

export type SearchType = (typeof SEARCH_TYPE_OPTIONS)[number]['value'];

// ============================================
// SORT OPTIONS (Discover endpoints)
// ============================================

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' },
  { value: 'vote_count.desc', label: 'Most Voted' },
  { value: 'vote_count.asc', label: 'Least Voted' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
  { value: 'revenue.asc', label: 'Lowest Revenue' },
  { value: 'primary_release_date.desc', label: 'Recent Releases' },
  { value: 'primary_release_date.asc', label: 'Oldest Releases' },
  { value: 'original_title.desc', label: 'Title (Z-A)' },
  { value: 'original_title.asc', label: 'Title (A-Z)' },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]['value'];

// ============================================
// TV SORT OPTIONS (TV discover uses different sort values)
// ============================================

export const TV_SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' },
  { value: 'vote_count.desc', label: 'Most Voted' },
  { value: 'vote_count.asc', label: 'Least Voted' },
  { value: 'first_air_date.desc', label: 'Newest First' },
  { value: 'first_air_date.asc', label: 'Oldest First' },
  { value: 'original_name.desc', label: 'Title (Z-A)' },
  { value: 'original_name.asc', label: 'Title (A-Z)' },
] as const;

export type TVSortOption = (typeof TV_SORT_OPTIONS)[number]['value'];

// ============================================
// MOVIE GENRES (TMDB /genre/movie/list)
// ============================================

export const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
] as const;

// ============================================
// TV GENRES (TMDB /genre/tv/list)
// NOTE: Different from movie genres — has Reality, Talk, Kids, etc.
// ============================================

export const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
] as const;

// ============================================
// GENRE HELPERS
// ============================================

export type MediaType = 'movie' | 'tv';

export type GenreOption = { readonly id: number; readonly name: string };

/**
 * Get the correct genre list for a given media type
 */
export function getGenresFor(type: MediaType): readonly GenreOption[] {
  return type === 'movie' ? MOVIE_GENRES : TV_GENRES;
}

/**
 * Get the correct sort options for a given media type
 */
export function getSortOptionsFor(type: MediaType) {
  return type === 'movie' ? SORT_OPTIONS : TV_SORT_OPTIONS;
}

// ============================================
// VOTE COUNT RANGE (Discover quality filter)
// ============================================

export const VOTE_COUNT_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 100, label: '100+' },
  { value: 500, label: '500+' },
  { value: 1000, label: '1,000+' },
  { value: 5000, label: '5,000+' },
  { value: 10000, label: '10,000+' },
] as const;

export type VoteCountOption = (typeof VOTE_COUNT_OPTIONS)[number]['value'];

// ============================================
// RUNTIME RANGE (Discover movie filter)
// ============================================

export const RUNTIME_OPTIONS = [
  { value: '0-60', label: 'Under 1 hour' },
  { value: '60-90', label: '1 – 1.5 hours' },
  { value: '90-120', label: '1.5 – 2 hours' },
  { value: '120-180', label: '2 – 3 hours' },
  { value: '180-999', label: 'Over 3 hours' },
] as const;

export type RuntimeOption = (typeof RUNTIME_OPTIONS)[number]['value'];

// ============================================
// FILTER DEFAULTS
// ============================================

export const FILTER_DEFAULTS = {
  // Search
  q: '',
  searchType: 'multi' as SearchType,
  language: 'en-US' as LanguageCode,
  adult: false,
  page: 1,

  // Discover
  sortBy: 'popularity.desc' as SortOption,
  minVoteCount: 0 as VoteCountOption,
  runtime: '' as RuntimeOption | '',
} as const;

// ============================================
// FILTER LIMITS
// ============================================

export const FILTER_LIMITS = {
  /** TMDB search returns max 500 pages */
  maxPages: 500,
  /** Min query length for search */
  minQueryLength: 2,
  /** Max query length accepted */
  maxQueryLength: 200,
  /** Debounce delay for search bar (ms) */
  debounceMs: 300,
  /** Throttle delay for rapid filter changes (ms) */
  throttleMs: 300,
} as const;

// ============================================
// LABEL HELPERS
// ============================================

export function getLanguageLabel(code: string): string {
  const lang = LANGUAGE_OPTIONS.find((l) => l.value === code);
  return lang?.label || code;
}

export function getSearchTypeLabel(type: string): string {
  const t = SEARCH_TYPE_OPTIONS.find((o) => o.value === type);
  return t?.label || type;
}

export function getSortLabel(sort: string): string {
  const s =
    SORT_OPTIONS.find((o) => o.value === sort) ||
    TV_SORT_OPTIONS.find((o) => o.value === sort);
  return s?.label || sort;
}

export function isValidLanguage(code: string): code is LanguageCode {
  return LANGUAGE_OPTIONS.some((l) => l.value === code);
}

export function isValidSearchType(type: string): type is SearchType {
  return SEARCH_TYPE_OPTIONS.some((t) => t.value === type);
}

// ============================================
// ORIGIN COUNTRY OPTIONS
// ISO 3166-1 codes for with_origin_country
// ============================================

export const ORIGIN_COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'IN', label: 'India' },
  { value: 'KR', label: 'South Korea' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'AR', label: 'Argentina' },
  { value: 'RU', label: 'Russia' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'TR', label: 'Turkey' },
  { value: 'TH', label: 'Thailand' },
  { value: 'ID', label: 'Indonesia' },
] as const;

export type OriginCountryCode = (typeof ORIGIN_COUNTRY_OPTIONS)[number]['value'];

// ============================================
// ORIGINAL LANGUAGE OPTIONS
// ISO 639-1 codes for with_original_language
// (Language the content was ORIGINALLY made in — distinct from UI language)
// ============================================

export const ORIGINAL_LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ru', label: 'Russian' },
  { value: 'ar', label: 'Arabic' },
  { value: 'tr', label: 'Turkish' },
  { value: 'th', label: 'Thai' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
] as const;

export type OriginalLanguageCode = (typeof ORIGINAL_LANGUAGE_OPTIONS)[number]['value'];

// ============================================
// TV NETWORK OPTIONS
// TMDB network IDs for with_networks (TV only)
// ============================================

export const NETWORK_OPTIONS = [
  { value: 213, label: 'Netflix' },
  { value: 2739, label: 'Disney+' },
  { value: 1024, label: 'Amazon Prime Video' },
  { value: 2552, label: 'Apple TV+' },
  { value: 49, label: 'HBO' },
  { value: 3186, label: 'Max' },
  { value: 4330, label: 'Paramount+' },
  { value: 453, label: 'Hulu' },
  { value: 4, label: 'BBC One' },
  { value: 2, label: 'ABC' },
  { value: 6, label: 'NBC' },
  { value: 16, label: 'CBS' },
  { value: 88, label: 'FX' },
  { value: 174, label: 'AMC' },
  { value: 67, label: 'Showtime' },
  { value: 71, label: 'The CW' },
  { value: 43, label: 'National Geographic' },
] as const;

export type NetworkId = (typeof NETWORK_OPTIONS)[number]['value'];

// ============================================
// CERTIFICATION OPTIONS (Movie only, US)
// ============================================

export const CERTIFICATION_OPTIONS = [
  { value: 'G', label: 'G — General Audiences' },
  { value: 'PG', label: 'PG — Parental Guidance' },
  { value: 'PG-13', label: 'PG-13 — Parents Strongly Cautioned' },
  { value: 'R', label: 'R — Restricted' },
  { value: 'NC-17', label: 'NC-17 — Adults Only' },
  { value: 'NR', label: 'NR — Not Rated' },
] as const;

export type CertificationCode = (typeof CERTIFICATION_OPTIONS)[number]['value'];

export const DEFAULT_CERTIFICATION_COUNTRY = 'US';

// ============================================
// VOTE AVERAGE OPTIONS (min + max)
// ============================================

export const VOTE_AVERAGE_MIN_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 5, label: '5+' },
  { value: 6, label: '6+' },
  { value: 7, label: '7+' },
  { value: 8, label: '8+' },
  { value: 9, label: '9+' },
] as const;

export const VOTE_AVERAGE_MAX_OPTIONS = [
  { value: 10, label: 'Any' },
  { value: 5, label: 'Up to 5' },
  { value: 6, label: 'Up to 6' },
  { value: 7, label: 'Up to 7' },
  { value: 8, label: 'Up to 8' },
  { value: 9, label: 'Up to 9' },
] as const;

export type VoteAverageMin = (typeof VOTE_AVERAGE_MIN_OPTIONS)[number]['value'];
export type VoteAverageMax = (typeof VOTE_AVERAGE_MAX_OPTIONS)[number]['value'];

// ============================================
// HELPER — Label lookups
// ============================================

export function getCountryLabel(code: string): string {
  const c = ORIGIN_COUNTRY_OPTIONS.find((o) => o.value === code);
  return c?.label || code;
}

export function getOriginalLanguageLabel(code: string): string {
  const l = ORIGINAL_LANGUAGE_OPTIONS.find((o) => o.value === code);
  return l?.label || code;
}

export function getNetworkLabel(id: number): string {
  const n = NETWORK_OPTIONS.find((o) => o.value === id);
  return n?.label || `Network ${id}`;
}