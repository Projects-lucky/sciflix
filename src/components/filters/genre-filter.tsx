"use client";

import { useQueryStates } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGenresFor, type MediaType } from "@/lib/config/filters.config";
import { DISCOVER_OPTIONS, discoverParsers } from "@/lib/search/nuqs-parsers";
import { cn } from "@/lib/utils";

export interface GenreFilterProps {
  type: MediaType;
  className?: string;
  label?: string;
}

export function GenreFilter({
  type,
  className,
  label = "Genre",
}: GenreFilterProps) {
  //  Pass DISCOVER_OPTIONS so shallow: false triggers server re-render
  const [{ withGenres }, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS,
  );

  const genres = getGenresFor(type);
  const currentValue = withGenres || "all";

  const handleChange = (value: string) => {
    setFilters({
      withGenres: value === "all" ? null : value,
      page: 1,
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor={`genre-filter-${type}`}
        className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap"
      >
        {label}
      </label>
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger
          id={`genre-filter-${type}`}
          className="w-44 h-9 bg-neutral-800 border-neutral-700 text-white text-sm"
        >
          <SelectValue placeholder="All Genres" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre.id} value={String(genre.id)}>
              {genre.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
