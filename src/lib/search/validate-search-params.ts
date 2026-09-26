/**
 * Validate Search Params
 * Bridge between nuqs parsers and Zod schemas
 *
 * Flow:
 *   URL → nuqs parse → Zod validate → safe params → services
 *
 * If validation fails, falls back to safe defaults.
 * Never throws. Never crashes.
 */

import { FILTER_DEFAULTS, FILTER_LIMITS } from "@/lib/config/filters.config";
import {
  type DiscoverMovieParamsSchema,
  type DiscoverTVParamsSchema,
  discoverMovieParamsSchema,
  discoverTVParamsSchema,
  type SearchParamsSchema,
  searchParamsSchema,
} from "@/lib/schemas/search.schema";
import type {
  DiscoverParamsFromParsers,
  SearchParamsFromParsers,
} from "./nuqs-parsers";

// ============================================
// SEARCH PARAMS VALIDATION
// ============================================

export function validateSearchParams(
  raw: SearchParamsFromParsers,
): SearchParamsSchema {
  const result = searchParamsSchema.safeParse(raw);

  if (result.success) {
    return result.data;
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[validateSearchParams] Validation failed:",
      result.error.flatten(),
      "Input:",
      raw,
    );
  }

  // Field-level fallback — preserve valid fields
  return {
    q:
      typeof raw.q === "string"
        ? raw.q.slice(0, FILTER_LIMITS.maxQueryLength)
        : FILTER_DEFAULTS.q,
    type: ["multi", "movie", "tv", "person"].includes(raw.type as string)
      ? (raw.type as SearchParamsSchema["type"])
      : FILTER_DEFAULTS.searchType,
    language:
      typeof raw.language === "string" && raw.language.length >= 2
        ? raw.language
        : FILTER_DEFAULTS.language,
    adult: typeof raw.adult === "boolean" ? raw.adult : FILTER_DEFAULTS.adult,
    page:
      typeof raw.page === "number" &&
      raw.page >= 1 &&
      raw.page <= FILTER_LIMITS.maxPages
        ? raw.page
        : FILTER_DEFAULTS.page,
  };
}

// ============================================
// DISCOVER PARAMS VALIDATION
// ============================================

/**
 * Validate parsed discover params for movies or TV
 */
export function validateDiscoverParams(
  raw: DiscoverParamsFromParsers,
  type: "movie" | "tv",
): DiscoverMovieParamsSchema | DiscoverTVParamsSchema {
  const schema =
    type === "movie" ? discoverMovieParamsSchema : discoverTVParamsSchema;
  const result = schema.safeParse(raw);

  if (result.success) {
    return result.data;
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[validateDiscoverParams:${type}] Validation failed:`,
      result.error.flatten(),
      "Input:",
      raw,
    );
  }

  // ─────────────────────────────────────────
  // Field-level fallback
  // ─────────────────────────────────────────

  const safePage =
    typeof raw.page === "number" &&
    raw.page >= 1 &&
    raw.page <= FILTER_LIMITS.maxPages
      ? raw.page
      : 1;

  // Shared safe values
  const common = {
    withGenres:
      typeof raw.withGenres === "string" && raw.withGenres.length > 0
        ? raw.withGenres
        : undefined,

    sortBy:
      typeof raw.sortBy === "string" && raw.sortBy.length > 0
        ? raw.sortBy
        : "popularity.desc",

    minVoteCount:
      typeof raw.minVoteCount === "number" && raw.minVoteCount >= 0
        ? raw.minVoteCount
        : 0,

    page: safePage,

    language:
      typeof raw.language === "string" && raw.language.length >= 2
        ? raw.language
        : "en-US",

    adult: typeof raw.adult === "boolean" ? raw.adult : false,

    // NEW: Country + Original Language
    withOriginCountry:
      typeof raw.withOriginCountry === "string" &&
      raw.withOriginCountry.length === 2
        ? raw.withOriginCountry.toUpperCase()
        : undefined,

    withOriginalLanguage:
      typeof raw.withOriginalLanguage === "string" &&
      raw.withOriginalLanguage.length === 2
        ? raw.withOriginalLanguage.toLowerCase()
        : undefined,

    // NEW: Vote average range
    voteAverageGte:
      typeof raw.voteAverageGte === "number" &&
      raw.voteAverageGte >= 0 &&
      raw.voteAverageGte <= 10
        ? raw.voteAverageGte
        : undefined,

    voteAverageLte:
      typeof raw.voteAverageLte === "number" &&
      raw.voteAverageLte >= 0 &&
      raw.voteAverageLte <= 10
        ? raw.voteAverageLte
        : undefined,
  };

  // ─────────────────────────────────────────
  // Movie-specific
  // ─────────────────────────────────────────

  if (type === "movie") {
    return {
      ...common,
      year:
        typeof raw.year === "number" && raw.year >= 1900 && raw.year <= 2100
          ? raw.year
          : undefined,

      runtime: typeof raw.runtime === "string" ? raw.runtime : "",

      // NEW: Release date range
      releaseDateGte:
        typeof raw.releaseDateGte === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(raw.releaseDateGte)
          ? raw.releaseDateGte
          : undefined,

      releaseDateLte:
        typeof raw.releaseDateLte === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(raw.releaseDateLte)
          ? raw.releaseDateLte
          : undefined,

      // NEW: Certification
      certification:
        typeof raw.certification === "string" && raw.certification.length > 0
          ? raw.certification
          : undefined,
    } as DiscoverMovieParamsSchema;
  }

  // ─────────────────────────────────────────
  // TV-specific
  // ─────────────────────────────────────────

  return {
    ...common,

    firstAirDateYear:
      typeof raw.firstAirDateYear === "number" &&
      raw.firstAirDateYear >= 1900 &&
      raw.firstAirDateYear <= 2100
        ? raw.firstAirDateYear
        : undefined,

    // NEW: First air date range
    firstAirDateGte:
      typeof raw.firstAirDateGte === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(raw.firstAirDateGte)
        ? raw.firstAirDateGte
        : undefined,

    firstAirDateLte:
      typeof raw.firstAirDateLte === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(raw.firstAirDateLte)
        ? raw.firstAirDateLte
        : undefined,

    // NEW: Networks
    withNetworks:
      typeof raw.withNetworks === "number" && raw.withNetworks > 0
        ? raw.withNetworks
        : undefined,
  } as DiscoverTVParamsSchema;
}

// ============================================
// QUERY HELPERS
// ============================================

export function canSearch(params: SearchParamsSchema): boolean {
  return params.q.trim().length >= FILTER_LIMITS.minQueryLength;
}

export function isWellFormedLanguage(code: string): boolean {
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(code);
}
