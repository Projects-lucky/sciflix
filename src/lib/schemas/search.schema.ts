/**
 * Search Schema (Zod)
 * Runtime validation for URL search params
 */

import { z } from "zod";
import {
  CERTIFICATION_OPTIONS,
  FILTER_LIMITS,
  LANGUAGE_OPTIONS,
  NETWORK_OPTIONS,
  ORIGIN_COUNTRY_OPTIONS,
  ORIGINAL_LANGUAGE_OPTIONS,
  RUNTIME_OPTIONS,
  SEARCH_TYPE_OPTIONS,
  SORT_OPTIONS,
  TV_SORT_OPTIONS,
  VOTE_AVERAGE_MAX_OPTIONS,
  VOTE_AVERAGE_MIN_OPTIONS,
  VOTE_COUNT_OPTIONS,
} from "@/lib/config/filters.config";

// ============================================
// EXTRACT VALID VALUES FROM CONFIG
// ============================================

const VALID_LANGUAGES = LANGUAGE_OPTIONS.map((l) => l.value) as [
  string,
  ...string[],
];
const VALID_SEARCH_TYPES = SEARCH_TYPE_OPTIONS.map((t) => t.value) as [
  string,
  ...string[],
];
const VALID_SORT_OPTIONS = Array.from(
  new Set([
    ...SORT_OPTIONS.map((s) => s.value),
    ...TV_SORT_OPTIONS.map((s) => s.value),
  ]),
) as [string, ...string[]];
// biome-ignore lint/correctness/noUnusedVariables: initial biome migration
const VALID_VOTE_COUNTS = VOTE_COUNT_OPTIONS.map((v) => v.value) as [
  number,
  ...number[],
];
const VALID_RUNTIMES = RUNTIME_OPTIONS.map((r) => r.value) as [
  string,
  ...string[],
];
const VALID_COUNTRIES = ORIGIN_COUNTRY_OPTIONS.map((c) => c.value) as [
  string,
  ...string[],
];
const VALID_ORIGINAL_LANGUAGES = ORIGINAL_LANGUAGE_OPTIONS.map(
  (l) => l.value,
) as [string, ...string[]];
const VALID_NETWORK_IDS = NETWORK_OPTIONS.map((n) => n.value) as [
  number,
  ...number[],
];
const VALID_CERTIFICATIONS = CERTIFICATION_OPTIONS.map((c) => c.value) as [
  string,
  ...string[],
];
// biome-ignore lint/correctness/noUnusedVariables: initial biome migration
const VALID_VOTE_AVG_MIN = VOTE_AVERAGE_MIN_OPTIONS.map((v) => v.value) as [
  number,
  ...number[],
];
// biome-ignore lint/correctness/noUnusedVariables: initial biome migration
const VALID_VOTE_AVG_MAX = VOTE_AVERAGE_MAX_OPTIONS.map((v) => v.value) as [
  number,
  ...number[],
];

// ============================================
// BASE SCHEMAS
// ============================================

export const querySchema = z.string().trim().max(FILTER_LIMITS.maxQueryLength);

export const pageSchema = z.number().int().min(1).max(FILTER_LIMITS.maxPages);

export const languageSchema = z.enum(VALID_LANGUAGES);

export const searchTypeSchema = z.enum(VALID_SEARCH_TYPES);

export const adultSchema = z.boolean();

export const sortSchema = z.enum(VALID_SORT_OPTIONS);

export const voteCountSchema = z.union([
  z.literal(0),
  z.literal(100),
  z.literal(500),
  z.literal(1000),
  z.literal(5000),
  z.literal(10000),
]);

export const runtimeSchema = z.enum(VALID_RUNTIMES);

// ─────────────────────────────────────────
// NEW: Validation schemas
// ─────────────────────────────────────────

/** ISO date string (YYYY-MM-DD) */
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
  .refine((val) => {
    const date = new Date(val);
    // biome-ignore lint/suspicious/noGlobalIsNan: initial biome migration
    return !isNaN(date.getTime());
  }, "Invalid date");

/** Origin country code (ISO 3166-1) */
export const originCountrySchema = z.enum(VALID_COUNTRIES);

/** Original language code (ISO 639-1) */
export const originalLanguageSchema = z.enum(VALID_ORIGINAL_LANGUAGES);

/** Network ID */
export const networkSchema = z.union(
  VALID_NETWORK_IDS.map((id) => z.literal(id)) as [
    z.ZodLiteral<number>,
    ...z.ZodLiteral<number>[],
  ],
);

/** Certification code */
export const certificationSchema = z.enum(VALID_CERTIFICATIONS);

/** Vote average (0–10) */
export const voteAverageSchema = z.number().int().min(0).max(10);

// ============================================
// SEARCH PARAMS SCHEMA
// ============================================

export const searchParamsSchema = z.object({
  q: querySchema.default(""),
  type: searchTypeSchema.default("multi"),
  language: languageSchema.default("en-US"),
  adult: adultSchema.default(false),
  page: pageSchema.default(1),
});

export type SearchParamsSchema = z.infer<typeof searchParamsSchema>;

// ============================================
// DISCOVER MOVIE PARAMS SCHEMA
// ============================================

export const discoverMovieParamsSchema = z.object({
  // Core filters
  withGenres: z.string().optional(),
  sortBy: sortSchema.default("popularity.desc"),
  minVoteCount: voteCountSchema.default(0),
  runtime: z.union([runtimeSchema, z.literal("")]).default(""),

  // Pagination + common
  page: pageSchema.default(1),
  language: languageSchema.default("en-US"),
  adult: adultSchema.default(false),

  // NEW: Country + Original Language
  withOriginCountry: originCountrySchema.optional(),
  withOriginalLanguage: originalLanguageSchema.optional(),

  // NEW: Release date range
  releaseDateGte: isoDateSchema.optional(),
  releaseDateLte: isoDateSchema.optional(),

  // Legacy: single year (kept for backward compatibility)
  year: z.coerce.number().int().min(1900).max(2100).optional(),

  // NEW: Vote average range
  voteAverageGte: voteAverageSchema.optional(),
  voteAverageLte: voteAverageSchema.optional(),

  // NEW: Certification (movie only)
  certification: certificationSchema.optional(),
});

export type DiscoverMovieParamsSchema = z.infer<
  typeof discoverMovieParamsSchema
>;

// ============================================
// DISCOVER TV PARAMS SCHEMA
// ============================================

export const discoverTVParamsSchema = z.object({
  // Core filters
  withGenres: z.string().optional(),
  sortBy: sortSchema.default("popularity.desc"),
  minVoteCount: voteCountSchema.default(0),

  // Pagination + common
  page: pageSchema.default(1),
  language: languageSchema.default("en-US"),
  adult: adultSchema.default(false),

  // NEW: Country + Original Language
  withOriginCountry: originCountrySchema.optional(),
  withOriginalLanguage: originalLanguageSchema.optional(),

  // NEW: First air date range
  firstAirDateGte: isoDateSchema.optional(),
  firstAirDateLte: isoDateSchema.optional(),

  // Legacy: single year (kept for backward compatibility)
  firstAirDateYear: z.coerce.number().int().min(1900).max(2100).optional(),

  // NEW: Vote average range
  voteAverageGte: voteAverageSchema.optional(),
  voteAverageLte: voteAverageSchema.optional(),

  // NEW: Networks (TV only)
  withNetworks: networkSchema.optional(),
});

export type DiscoverTVParamsSchema = z.infer<typeof discoverTVParamsSchema>;

// ============================================
// VALIDATION HELPERS
// ============================================

export function validateSearchParams(input: unknown): SearchParamsSchema {
  const result = searchParamsSchema.safeParse(input);
  if (result.success) return result.data;

  return {
    q: "",
    type: "multi",
    language: "en-US",
    adult: false,
    page: 1,
  };
}

export function isValidQuery(query: string): boolean {
  const trimmed = query.trim();
  return (
    trimmed.length >= FILTER_LIMITS.minQueryLength &&
    trimmed.length <= FILTER_LIMITS.maxQueryLength
  );
}

export function clampPage(page: number): number {
  return Math.max(1, Math.min(FILTER_LIMITS.maxPages, Math.floor(page)));
}
