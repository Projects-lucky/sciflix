/**
 * OriginalLanguageFilter Component
 * Dropdown to filter by content's original language
 * Uses with_original_language on TMDB discover endpoints
 *
 * Distinct from LanguageFilter (which sets UI language)
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
import { ORIGINAL_LANGUAGE_OPTIONS } from "@/lib/config/filters.config";
import { DISCOVER_OPTIONS, discoverParsers } from "@/lib/search/nuqs-parsers";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface OriginalLanguageFilterProps {
  className?: string;
  label?: string;
}

// ============================================
// COMPONENT
// ============================================

export function OriginalLanguageFilter({
  className,
  label = "Original Lang",
}: OriginalLanguageFilterProps) {
  const [{ withOriginalLanguage }, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS,
  );

  const currentValue = withOriginalLanguage || "all";

  const handleChange = (value: string) => {
    setFilters({
      withOriginalLanguage: value === "all" ? null : value,
      page: 1,
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor="original-language-filter"
        className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap"
      >
        {label}
      </label>
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger
          id="original-language-filter"
          className="w-40 h-9 bg-neutral-800 border-neutral-700 text-white text-sm"
        >
          <SelectValue placeholder="Any Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Language</SelectItem>
          {ORIGINAL_LANGUAGE_OPTIONS.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
