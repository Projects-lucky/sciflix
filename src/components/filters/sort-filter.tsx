"use client";

import { useQueryStates } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSortOptionsFor, type MediaType } from "@/lib/config/filters.config";
import { DISCOVER_OPTIONS, discoverParsers } from "@/lib/search/nuqs-parsers";
import { cn } from "@/lib/utils";

export interface SortFilterProps {
  type: MediaType;
  className?: string;
  label?: string;
}

export function SortFilter({
  type,
  className,
  label = "Sort",
}: SortFilterProps) {
  // ✅ Pass DISCOVER_OPTIONS so shallow: false triggers server re-render
  const [{ sortBy }, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS,
  );

  const options = getSortOptionsFor(type);
  const currentValue = sortBy || "popularity.desc";

  const handleChange = (value: string) => {
    setFilters({
      sortBy: value,
      page: 1,
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor={`sort-filter-${type}`}
        className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap"
      >
        {label}
      </label>
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger
          id={`sort-filter-${type}`}
          className="w-44 h-9 bg-neutral-800 border-neutral-700 text-white text-sm"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
