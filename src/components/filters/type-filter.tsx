/**
 * TypeFilter Component
 * Dropdown to select search type (multi, movie, tv, person)
 * Self-contained: reads/writes URL directly via nuqs
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
import { SEARCH_TYPE_OPTIONS } from "@/lib/config/filters.config";
import { NUQS_OPTIONS, searchParsers } from "@/lib/search/nuqs-parsers";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface TypeFilterProps {
  className?: string;
  label?: string;
}

// ============================================
// COMPONENT
// ============================================

export function TypeFilter({ className, label = "Type" }: TypeFilterProps) {
  const [{ type }, setFilters] = useQueryStates(searchParsers, NUQS_OPTIONS);

  const handleChange = (value: string) => {
    setFilters({
      type: value as "multi" | "movie" | "tv" | "person",
      page: 1,
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor="type-filter"
        className="text-xs text-gray-400 uppercase tracking-wider whitespace-nowrap"
      >
        {label}
      </label>
      <Select value={type} onValueChange={handleChange}>
        <SelectTrigger
          id="type-filter"
          className="w-28 h-9 bg-neutral-800 border-neutral-700 text-white text-sm"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SEARCH_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
