/**
 * SearchRecent Component
 * Displays recent searches from Zustand
 * Only renders when there are stored searches
 */

'use client';

import { Clock, X, Trash2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useSearchStore } from '@/stores/search-store';

// ============================================
// COMPONENT
// ============================================

export function SearchRecent() {
  const { recentSearches, removeRecentSearch, clearRecentSearches } =
    useSearchStore();
  const [, setQuery] = useQueryState('q');

  // Nothing to show
  if (!recentSearches || recentSearches.length === 0) {
    return null;
  }

  const handleSelect = (query: string) => {
    setQuery(query);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Recent searches</span>
        </div>
        <button
          type="button"
          onClick={clearRecentSearches}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear all
        </button>
      </div>

      {/* List */}
      <ul className="flex flex-wrap gap-2">
        {recentSearches.map((query) => (
          <li key={query}>
            <div className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 rounded-full pl-3 pr-1 py-1.5 transition-colors group">
              <button
                type="button"
                onClick={() => handleSelect(query)}
                className="text-sm text-gray-300  hover:text-white transition-colors"
              >
                {query}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeRecentSearch(query);
                }}
                className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-neutral-600 transition-colors"
                aria-label={`Remove "${query}"`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}