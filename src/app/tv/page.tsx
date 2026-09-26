/**
 * TV Browse Page - Server Component
 * Route: /tv?withGenres=...&sortBy=...&firstAirDateYear=...&page=...
 *
 * Responsibilities:
 * - Parse URL params (nuqs server cache)
 * - Validate via Zod (TV schema)
 * - Pass clean params to client wrapper
 */

import type { Metadata } from "next";
import { discoverParamsCache } from "@/lib/search/nuqs-parsers";
import { validateDiscoverParams } from "@/lib/search/validate-search-params";
import { TVClient } from "./tv-client";

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
  title: "TV Shows",
  description: "Browse TV shows by genre, sort, and filters",
};

// ============================================
// PAGE
// ============================================

export default async function TVPage({ searchParams }: PageProps) {
  // Parse URL params via nuqs server cache
  const raw = discoverParamsCache.parse(await searchParams);

  // Validate as TV — uses firstAirDateYear instead of year
  const params = validateDiscoverParams(raw, "tv");

  return (
    <div className="min-h-screen pt-3.5 pb-16">
      <div className="mx-auto px-4">
        <div className="mb-6 w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-semibold font-poppins tracking-wide capitalize">
            tv shows
          </h1>
          <p className="text-lg text-muted-foreground mt-1 font-extralight tracking-wide font-poppins capitalize">
            Browse tv shows by genre, sort, and filters
          </p>
        </div>

        <TVClient params={params} />
      </div>
    </div>
  );
}
