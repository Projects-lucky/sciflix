/**
 * OriginCountryFilter Component
 * Dropdown to filter by content's origin country
 * Uses with_origin_country on TMDB discover endpoints
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
import { ORIGIN_COUNTRY_OPTIONS } from "@/lib/config/filters.config";
import { DISCOVER_OPTIONS, discoverParsers } from "@/lib/search/nuqs-parsers";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface OriginCountryFilterProps {
  className?: string;
  label?: string;
}

// ============================================
// COMPONENT
// ============================================

export function OriginCountryFilter({
  className,
  label = "Country",
}: OriginCountryFilterProps) {
  const [{ withOriginCountry }, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS,
  );

  const currentValue = withOriginCountry || "all";

  const handleChange = (value: string) => {
    setFilters({
      withOriginCountry: value === "all" ? null : value,
      page: 1,
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor="origin-country-filter"
        className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap"
      >
        {label}
      </label>
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger
          id="origin-country-filter"
          className="w-44 h-9 bg-neutral-800 border-neutral-700 text-white text-sm"
        >
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {ORIGIN_COUNTRY_OPTIONS.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
