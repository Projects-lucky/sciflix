/**
 * FilterBar Component
 * Always-visible bar with:
 * - 3 inline primary filters (Genre, Sort, Language)
 * - Adult toggle
 * - "More Filters" button → opens FilterDialog
 * - Reset button
 *
 * Responsive:
 * - Mobile: filters stack vertically
 * - Desktop: filters inline
 */

"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MediaType } from "@/lib/config/filters.config";
import { cn } from "@/lib/utils";
import { AdultFilter } from "./adult-filter";
import { FilterDialog } from "./filter-dialog";
import { GenreFilter } from "./genre-filter";
import { LanguageFilter } from "./language-filter";
import { ResetFiltersButton } from "./reset-filters-button";
import { SortFilter } from "./sort-filter";
import { useActiveFilterCount } from "./use-active-filter-count";

// ============================================
// TYPES
// ============================================

export interface FilterBarProps {
  type: MediaType;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function FilterBar({ type, className }: FilterBarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const activeCount = useActiveFilterCount();

  // Filters shown inline (not in dialog)
  // const PRIMARY_COUNT = 4; // Genre, Sort, Language, Adult
  // Filters hidden in dialog = total active - active in primaries
  // (simple heuristic — the dialog shows all filters anyway)
  const advancedActiveCount = Math.max(0, activeCount);

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-3 p-4 rounded-lg",
          "md:flex-row md:flex-wrap md:items-center md:gap-3",
          className,
        )}
      >
        {/* Primary filters — stack on mobile, inline on desktop */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3 md:flex-wrap">
          <GenreFilter type={type} />
          <SortFilter type={type} />
          <LanguageFilter variant="discover" />
          <AdultFilter variant="discover" />
        </div>

        {/* Right side: More Filters + Reset */}
        <div className="flex items-center gap-2 md:ml-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="gap-2 h-9 bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
            More Filters
            {advancedActiveCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-orange-600 text-white">
                {advancedActiveCount}
              </span>
            )}
          </Button>

          <ResetFiltersButton variant="discover" />
        </div>
      </div>

      {/* Dialog with all filters */}
      <FilterDialog
        type={type}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
