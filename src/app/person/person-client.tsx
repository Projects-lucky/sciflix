/**
 * PersonClient
 * Client wrapper that renders the infinite grid of popular people.
 *
 * Uses:
 * - InfiniteScroll — handles pagination + IntersectionObserver
 * - PersonCard — circular avatar + name + role
 * - getPopularPeople via /api/tmdb proxy (no token exposure)
 */

"use client";

import { PersonGridCard } from "@/components/person/PersonCardPresets";
import { SearchEmpty } from "@/components/search/search-empty";
import {
  type InfinitePage,
  InfiniteScroll,
} from "@/components/shared/infinite-scroll";
import type { TMDBPerson } from "@/types/person.types";

// ============================================
// FETCH FUNCTION
// ============================================

/**
 * Fetch one page of popular people through the proxy.
 * URL: /api/tmdb/person/popular?page=N
 */
async function fetchPopularPeople(
  page: number,
): Promise<InfinitePage<TMDBPerson>> {
  const query = new URLSearchParams({
    page: String(page),
    language: "en-US",
  });

  const response = await fetch(`/api/tmdb/person/popular?${query.toString()}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch people: ${response.status}`);
  }

  const data = (await response.json()) as {
    page: number;
    results: TMDBPerson[];
    total_pages: number;
    total_results: number;
  };

  // Filter out adult content
  const results = (data.results ?? []).filter((p) => !p.adult);

  return {
    results,
    page: data.page ?? page,
    total_pages: data.total_pages ?? 1,
    total_results: data.total_results ?? 0,
  };
}

// ============================================
// COMPONENT
// ============================================

export function PersonClient() {
  return (
    <InfiniteScroll<TMDBPerson>
      queryKey={["people-popular"]}
      fetchFn={fetchPopularPeople}
      getItemKey={(person) => `person-${person.id}`}
      renderItem={(person) => (
        <PersonGridCard
          className="w-full h-84 md:w-58 md:h-99 border-none"
          key={person.id}
          person={person}
        />
      )}
      emptyState={<SearchEmpty variant="no-results" query="popular people" />}
      className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] justify-items-stretch items-stretch gap-x-4 auto-rows-85 sm:auto-rows-90 md:auto-rows-105 gap-y-8 md:gap-9 w-full"
    />
  );
}
