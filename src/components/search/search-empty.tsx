/**
 * SearchEmpty Component
 * Handles all empty states for search
 * - no-query: user hasn't typed yet → show recent searches
 * - no-results: query returned nothing
 * - error: API failed
 */

"use client";

import { AlertCircle, Film, Search } from "lucide-react";
import { SearchRecent } from "./search-recent";

// ============================================
// TYPES
// ============================================

interface SearchEmptyProps {
  variant: "no-query" | "no-results" | "error";
  query?: string;
}

// ============================================
// COMPONENT
// ============================================

export function SearchEmpty({ variant, query }: SearchEmptyProps) {
  // ─────────────────────────────────────
  // No query — show recent searches
  // ─────────────────────────────────────
  if (variant === "no-query") {
    return (
      <div className="mt-8">
        <div className="text-center py-8">
          <Search className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold font-poppins mb-2">
            Start typing to search
          </h2>
          <p className="text-sm text-gray-400">
            Search for movies, TV shows, or people
          </p>
        </div>

        <SearchRecent />
      </div>
    );
  }

  // ─────────────────────────────────────
  // No results
  // ─────────────────────────────────────
  if (variant === "no-results") {
    return (
      <div className="text-center py-16">
        <Film className="w-12 h-12 mx-auto text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold font-poppins mb-2">
          No results found
        </h2>
        <p className="text-sm text-gray-400">
          {query
            ? `Nothing matched "${query}". Try different keywords.`
            : "Try a different search."}
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────
  // Error state
  // ─────────────────────────────────────
  return (
    <div className="text-center py-16">
      <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
      <h2 className="text-xl font-semibold font-poppins mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-gray-400">
        We couldn't complete your search. Please try again.
      </p>
    </div>
  );
}
