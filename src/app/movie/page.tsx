/**
 * Movie Browse Page - Server Component
 * Route: /movie?withGenres=...&sortBy=...&year=...&page=...
 *
 * Responsibilities:
 * - Parse URL params (nuqs server cache)
 * - Validate via Zod
 * - Pass clean params to client wrapper
 *
 * Data fetching happens client-side (InfiniteScroll + TanStack Query)
 * because pagination requires client state.
 */

import type { Metadata } from "next";
import { discoverParamsCache } from "@/lib/search/nuqs-parsers";
import { validateDiscoverParams } from "@/lib/search/validate-search-params";
import { MovieClient } from "./movie-client";

// ============================================
// TYPES
// ============================================

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse movies by genre, sort, and filters",
};

// ============================================
// PAGE
// ============================================

export default async function MoviesPage({ searchParams }: PageProps) {
  // Parse URL params via nuqs server cache
  const raw = discoverParamsCache.parse(await searchParams);

  // Validate + apply safe fallbacks
  const params = validateDiscoverParams(raw, "movie");

  return (
    <div className="min-h-screen w-full pt-3.5 pb-16">
      <div className="mx-auto px-4">
        <div className="mb-6 w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-semibold font-poppins tracking-wide capitalize">
            Movies
          </h1>
          <p className="text-lg text-muted-foreground mt-1 font-extralight tracking-wide font-poppins capitalize">
            Browse movies by genre, sort, and filters
          </p>
        </div>
        <MovieClient params={params} />
      </div>
    </div>
  );
}
