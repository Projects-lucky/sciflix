/**
 * Search Client Component
 * Owns the entire search UX — bar, filters, results, empty states
 */

"use client";

import { AdultFilter } from "@/components/filters/adult-filter";
import { LanguageFilter } from "@/components/filters/language-filter";
import { ResetFiltersButton } from "@/components/filters/reset-filters-button";
import { TypeFilter } from "@/components/filters/type-filter";
import { MovieCard } from "@/components/movie/movie-card";
import { PersonGridCard } from "@/components/person/PersonCardPresets";
import { SearchEmpty } from "@/components/search/search-empty";
import {
  type InfinitePage,
  InfiniteScroll,
} from "@/components/shared/infinite-scroll";
import type { SearchResultItem, SearchType } from "@/hooks/use-infinite-search";
import type { TMDBMovie } from "@/types/movie.types";
import type { TMDBPerson } from "@/types/person.types";
import type { TMDBTV } from "@/types/tv.types";
import { SearchBar } from "./search-bar";

// ============================================
// TYPES
// ============================================

export interface SearchClientProps {
  query: string;
  type: SearchType;
  language: string;
  adult: boolean;
}

// ============================================
// HELPERS
// ============================================

function isMovie(item: SearchResultItem): item is TMDBMovie {
  return "title" in item;
}

function isTV(item: SearchResultItem): item is TMDBTV {
  return "name" in item && "first_air_date" in item;
}

function isPerson(item: SearchResultItem): item is TMDBPerson {
  return "known_for" in item;
}

function getMediaType(item: SearchResultItem): "movie" | "tv" {
  if (item.media_type === "movie" || item.media_type === "tv") {
    return item.media_type;
  }
  return isMovie(item) ? "movie" : "tv";
}

// ============================================
// FETCH FUNCTION
// ============================================

async function fetchSearchPage(
  query: string,
  type: SearchType,
  language: string,
  adult: boolean,
  page: number,
): Promise<InfinitePage<SearchResultItem>> {
  const params = new URLSearchParams({
    query,
    page: String(page),
    language,
    include_adult: String(adult),
  });

  const response = await fetch(
    `/api/tmdb/search/${type}?${params.toString()}`,
    { headers: { Accept: "application/json" } },
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    page: number;
    results: SearchResultItem[];
    total_pages: number;
    total_results: number;
  };

  return {
    results: data.results ?? [],
    page: data.page ?? page,
    total_pages: data.total_pages ?? 1,
    total_results: data.total_results ?? 0,
  };
}

// ============================================
// COMPONENT
// ============================================

export function SearchClient({
  query,
  type,
  language,
  adult,
}: SearchClientProps) {
  const isSearchable = query.trim().length >= 2;

  return (
    <>
      {/* Search bar */}
      <SearchBar />

      {/* Filters */}
      <div className="flex flex-wrap max-w-3xl mx-auto items-center gap-3 mt-4 p-4 border rounded-lg">
        <TypeFilter />
        <LanguageFilter />
        <AdultFilter />
        <div className="ml-auto">
          <ResetFiltersButton className="border" />
        </div>
      </div>

      {/* Results or empty */}
      {!isSearchable ? (
        <SearchEmpty variant="no-query" />
      ) : (
        <div className="mt-6">
          <InfiniteScroll<SearchResultItem>
            queryKey={["search", query, type, language, adult]}
            fetchFn={(page) =>
              fetchSearchPage(query, type, language, adult, page)
            }
            getItemKey={(item, index) => {
              if (!item || typeof item !== "object" || !("id" in item)) {
                return `unknown-${index}`;
              }
              const mediaType =
                item.media_type ?? (isMovie(item) ? "movie" : "tv");
              return `${mediaType}-${item.id}`;
            }}
            renderItem={(item) => {
              if (isPerson(item)) {
                return (
                  <PersonGridCard
                    className="w-58 h-98"
                    key={item.id}
                    person={item}
                  />
                );
              }

              // const mediaType = getMediaType(item);
              return (
                <MovieCard
                  className="w-58 h-98"
                  item={item as TMDBMovie | TMDBTV}
                />
              );
            }}
            emptyState={<SearchEmpty variant="no-results" query={query} />}
            className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] justify-items-center items-stretch auto-rows-85 sm:auto-rows-90 md:auto-rows-105 gap-x-4 gap-y-14 md:gap-y-10 md:gap-x-9 w-full"
          />
        </div>
      )}
    </>
  );
}
