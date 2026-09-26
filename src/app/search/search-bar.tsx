/**
 * SearchBar Component
 * Debounced input that updates ?q= in URL
 * Uses nuqs built-in debounce (no custom hooks)
 */

"use client";

import { Search, X } from "lucide-react";
import { debounce, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { SEARCH_BAR_OPTIONS } from "@/lib/search/nuqs-parsers";
import { useSearchStore } from "@/stores/search-store";

// ============================================
// COMPONENT
// ============================================

export function SearchBar() {
  const [isPending, startTransition] = useTransition();
  const { addRecentSearch } = useSearchStore();

  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      ...SEARCH_BAR_OPTIONS,
      startTransition: (fn) => startTransition(fn),
      limitUrlUpdates: debounce(300),
    }),
  );

  // Local input value for immediate typing feedback
  const [inputValue, setInputValue] = useState(query);

  // Sync local value when query changes externally (back button, clear, etc.)
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Track recent searches when query stabilizes
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(() => {
      addRecentSearch(query);
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, addRecentSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Empty = immediate clear (no debounce)
    if (value === "") {
      setQuery("", { limitUrlUpdates: undefined });
    } else {
      setQuery(value);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setQuery("", { limitUrlUpdates: undefined });
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        {/* Search Icon */}
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
          aria-hidden="true"
        />

        {/* Input */}
        <Input
          type="search"
          placeholder="Search movies, TV shows, people..."
          value={inputValue}
          onChange={handleChange}
          autoComplete="off"
          spellCheck={false}
          className="pl-10 pr-10 h-11 max-w-xl bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-amber-600"
        />

        {/* Pending Spinner OR Clear Button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isPending ? (
            <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
          ) : inputValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}