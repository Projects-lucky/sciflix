/**
 * Search Store (Zustand)
 * Ephemeral client-only state for search UX
 *
 * What lives here:
 *   - Recent searches (persisted to localStorage)
 *   - Pending/loading indicators
 *   - Client-side UI flags
 *
 * What does NOT live here:
 *   - Search filters (q, type, language, adult, page) → nuqs URL state
 *   - Server data (results, trending) → Server Components
 *
 * Why the split?
 *   - URL state = shareable, bookmarkable, back-button friendly
 *   - Zustand = client-only, ephemeral, cross-component
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================
// TYPES
// ============================================

interface SearchState {
  // ─────────────────────────────────────────
  // Recent searches (persisted)
  // ─────────────────────────────────────────
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // ─────────────────────────────────────────
  // UI state (not persisted)
  // ─────────────────────────────────────────
  isSearching: boolean;
  setSearching: (searching: boolean) => void;

  // ─────────────────────────────────────────
  // Reset
  // ─────────────────────────────────────────
  reset: () => void;
}

// ============================================
// CONSTANTS
// ============================================

const MAX_RECENT_SEARCHES = 10;

const initialState = {
  recentSearches: [] as string[],
  isSearching: false,
};

// ============================================
// STORE
// ============================================

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ─────────────────────────────────────
      // Recent searches
      // ─────────────────────────────────────
      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed || trimmed.length < 2) return;

        const current = get().recentSearches;

        // Deduplicate (move to top if exists)
        const filtered = current.filter(
          (q) => q.toLowerCase() !== trimmed.toLowerCase(),
        );

        // Prepend and cap
        const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);

        set({ recentSearches: updated });
      },

      removeRecentSearch: (query) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((q) => q !== query),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),

      // ─────────────────────────────────────
      // UI state
      // ─────────────────────────────────────
      setSearching: (isSearching) => set({ isSearching }),

      // ─────────────────────────────────────
      // Reset
      // ─────────────────────────────────────
      reset: () => set(initialState),
    }),
    {
      name: "search-storage",
      // Only persist recent searches — UI state is ephemeral
      partialize: (state) => ({
        recentSearches: state.recentSearches,
      }),
      // Skip hydration on SSR
      skipHydration: true,
    },
  ),
);
