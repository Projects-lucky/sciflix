/**
 * VoteAverageFilter Component
 * Filters content by vote average range (min to max)
 * Uses vote_average.gte and vote_average.lte
 * Works on both movie and TV discover endpoints
 */

"use client";

import { useQueryStates } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  VOTE_AVERAGE_MAX_OPTIONS,
  VOTE_AVERAGE_MIN_OPTIONS,
} from "@/lib/config/filters.config";
import { DISCOVER_OPTIONS, discoverParsers } from "@/lib/search/nuqs-parsers";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface VoteAverageFilterProps {
  className?: string;
  label?: string;
}

// ============================================
// COMPONENT
// ============================================

export function VoteAverageFilter({
  className,
  label = "Rating",
}: VoteAverageFilterProps) {
  const [{ voteAverageGte, voteAverageLte }, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS,
  );

  // Default to "any" when unset
  const minValue =
    voteAverageGte !== undefined ? String(voteAverageGte) : "any";
  const maxValue =
    voteAverageLte !== undefined ? String(voteAverageLte) : "any";

  const handleMinChange = (value: string) => {
    setFilters({
      voteAverageGte: value === "any" ? null : Number(value),
      page: 1,
    });
  };

  const handleMaxChange = (value: string) => {
    setFilters({
      voteAverageLte: value === "any" ? null : Number(value),
      page: 1,
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>

      <div className="flex items-center gap-1.5">
        {/* Min */}
        <Select value={minValue} onValueChange={handleMinChange}>
          <SelectTrigger
            className="w-24 h-9 bg-neutral-800 border-neutral-700 text-white text-sm"
            aria-label="Minimum rating"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOTE_AVERAGE_MIN_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.value === 0 ? "Any" : opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground text-xs">to</span>

        {/* Max */}
        <Select value={maxValue} onValueChange={handleMaxChange}>
          <SelectTrigger
            className="w-28 h-9 bg-neutral-800 border-neutral-700 text-white text-sm"
            aria-label="Maximum rating"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOTE_AVERAGE_MAX_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.value === 10 ? "Any" : opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
