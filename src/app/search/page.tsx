/**
 * Search Page - Server Component
 * Route: /search?q=...&type=...&language=...&adult=...
 */

import type { Metadata } from "next";
import type { SearchType } from "@/hooks/use-infinite-search";
import { searchParamsCache } from "@/lib/search/nuqs-parsers";
import { validateSearchParams } from "@/lib/search/validate-search-params";
import { SearchClient } from "./search-client";

// ============================================
// TYPES
// ============================================

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ============================================
// PAGE
// ============================================

export default async function SearchPage({ searchParams }: PageProps) {
  const raw = searchParamsCache.parse(await searchParams);
  const { q, type, language, adult } = validateSearchParams(raw);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto px-4">
        <SearchClient
          query={q}
          type={type as SearchType}
          language={language}
          adult={adult}
        />
      </div>
    </div>
  );
}

// ============================================
// METADATA (SEO + OpenGraph)
// ============================================

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const raw = searchParamsCache.parse(await searchParams);
  const { q } = validateSearchParams(raw);

  const query = q.trim();
  const isSearchable = query.length >= 2;

  const title = isSearchable ? `Search: ${query}` : "Search";
  const description = isSearchable
    ? `Search results for "${query}" — movies, TV shows, and people.`
    : "Search movies, TV shows, and people.";

  return {
    title,
    description,

    openGraph: {
      type: "website",
      title,
      description,
      url: isSearchable ? `/search?q=${encodeURIComponent(query)}` : "/search",
    },

    twitter: {
      card: "summary",
      title,
      description,
    },

    // Search results shouldn't be indexed — dynamic and noisy
    robots: {
      index: false,
      follow: true,
    },

    alternates: {
      canonical: isSearchable
        ? `/search?q=${encodeURIComponent(query)}`
        : "/search",
    },
  };
}
