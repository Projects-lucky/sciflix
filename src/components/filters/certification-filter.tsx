/**
 * CertificationFilter Component
 * Dropdown to filter movies by certification (age rating)
 * Uses certification + certification_country=US
 * Movie only — TV has no age certification on TMDB
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
import { CERTIFICATION_OPTIONS } from "@/lib/config/filters.config";
import { DISCOVER_OPTIONS, discoverParsers } from "@/lib/search/nuqs-parsers";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface CertificationFilterProps {
  className?: string;
  label?: string;
}

// ============================================
// COMPONENT
// ============================================

export function CertificationFilter({
  className,
  label = "Rated",
}: CertificationFilterProps) {
  const [{ certification }, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS,
  );

  const currentValue = certification || "all";

  const handleChange = (value: string) => {
    setFilters({
      certification: value === "all" ? null : value,
      page: 1,
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor="certification-filter"
        className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap"
      >
        {label}
      </label>
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger
          id="certification-filter"
          className="w-52 h-9 bg-neutral-800 border-neutral-700 text-white text-sm"
        >
          <SelectValue placeholder="Any Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Rating</SelectItem>
          {CERTIFICATION_OPTIONS.map((cert) => (
            <SelectItem key={cert.value} value={cert.value}>
              {cert.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
