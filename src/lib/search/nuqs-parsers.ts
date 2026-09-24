/**
 * nuqs Parsers & Server Cache
 * Shared between client (useQueryStates) and server (searchParamsCache)
 */

import {
  parseAsString,
  parseAsBoolean,
  parseAsInteger,
  parseAsStringLiteral,
  createSearchParamsCache,
  type inferParserType,
} from 'nuqs/server';

import { FILTER_DEFAULTS, FILTER_LIMITS } from '@/lib/config/filters.config';

// ============================================
// SEARCH PARSERS
// ============================================

export const searchParsers = {
  q: parseAsString.withDefault(FILTER_DEFAULTS.q),

  type: parseAsStringLiteral([
    'multi',
    'movie',
    'tv',
    'person',
  ] as const).withDefault(FILTER_DEFAULTS.searchType),

  language: parseAsString.withDefault(FILTER_DEFAULTS.language),

  adult: parseAsBoolean.withDefault(FILTER_DEFAULTS.adult),

  page: parseAsInteger.withDefault(FILTER_DEFAULTS.page),
} as const;

export type SearchParamsFromParsers = inferParserType<typeof searchParsers>;

// ============================================
// DISCOVER PARSERS
// Used by /movie and /tv discover pages
// ============================================

export const discoverParsers = {
  // ─────────────────────────────────────────
  // Core filters (existing)
  // ─────────────────────────────────────────

  /** Genre IDs (comma-separated) */
  withGenres: parseAsString,

  /** Sort order (e.g., 'popularity.desc') */
  sortBy: parseAsString.withDefault('popularity.desc'),

  /** Minimum vote count threshold */
  minVoteCount: parseAsInteger.withDefault(0),

  /** Runtime range (movies only) */
  runtime: parseAsString,

  /** Pagination */
  page: parseAsInteger.withDefault(1),

  /** UI language for results (e.g., 'en-US') */
  language: parseAsString.withDefault('en-US'),

  /** Include adult content */
  adult: parseAsBoolean.withDefault(false),

  // ─────────────────────────────────────────
  // NEW: Country & Original Language
  // ─────────────────────────────────────────

  /** Origin country (ISO 3166-1) — with_origin_country */
  withOriginCountry: parseAsString,

  /** Original language of content (ISO 639-1) — with_original_language */
  withOriginalLanguage: parseAsString,

  // ─────────────────────────────────────────
  // NEW: Release date range (movie)
  // ─────────────────────────────────────────

  /** Release date >= YYYY-MM-DD */
  releaseDateGte: parseAsString,

  /** Release date <= YYYY-MM-DD */
  releaseDateLte: parseAsString,

  /** Year (legacy — kept for compatibility) */
  year: parseAsInteger,

  // ─────────────────────────────────────────
  // NEW: First air date range (TV)
  // ─────────────────────────────────────────

  /** First air date >= YYYY-MM-DD */
  firstAirDateGte: parseAsString,

  /** First air date <= YYYY-MM-DD */
  firstAirDateLte: parseAsString,

  /** First air date year (legacy) */
  firstAirDateYear: parseAsInteger,

  // ─────────────────────────────────────────
  // NEW: Vote average range
  // ─────────────────────────────────────────

  /** Minimum vote average (0–10) */
  voteAverageGte: parseAsInteger,

  /** Maximum vote average (0–10) */
  voteAverageLte: parseAsInteger,

  // ─────────────────────────────────────────
  // NEW: Networks (TV only)
  // ─────────────────────────────────────────

  /** Network ID — with_networks (TV only) */
  withNetworks: parseAsInteger,

  // ─────────────────────────────────────────
  // NEW: Certification (movie only)
  // ─────────────────────────────────────────

  /** Certification code (e.g., 'PG-13') — pairs with certification_country */
  certification: parseAsString,
} as const;

export type DiscoverParamsFromParsers = inferParserType<typeof discoverParsers>;

// ============================================
// SERVER CACHES
// ============================================

export const searchParamsCache = createSearchParamsCache(searchParsers);

export const discoverParamsCache = createSearchParamsCache(discoverParsers);

// ============================================
// NUQS OPTIONS (shared client config)
// ============================================

export const NUQS_OPTIONS = {
  shallow: false,
  throttleMs: FILTER_LIMITS.throttleMs,
  clearOnDefault: true,
} as const;

export const SEARCH_BAR_OPTIONS = {
  shallow: false,
  clearOnDefault: true,
} as const;

export const DISCOVER_OPTIONS = {
  shallow: false,
  throttleMs: FILTER_LIMITS.throttleMs,
  clearOnDefault: true,
} as const;