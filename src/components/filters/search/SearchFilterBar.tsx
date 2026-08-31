/**
 * Search Filter Bar Component
 * 
 * Main search interface with query input and filter controls.
 * Includes a dialog for advanced search parameters.
 * Displays loading state and reset functionality.
 */

"use client";

import { QueryInput } from "./QueryInput";
import { TypeFilter } from "./TypeFilter";
import { LanguageFilter } from "../LanguageFilter";
import { YearFilter } from "../YearFilter";
import { IncludeAdultFilter } from "../IncludeAdultFilter";
import { FilterOption } from "../types";
import { Button } from "@/components/ui/button";
import { FunnelPlus, RotateCcw, Search } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FilterState {
  q: string;
  type: string;
  year: string;
  language: string;
  includeAdult: string;
  page: number;
}

interface SearchFilterBarProps {
  filters: FilterState;
  typeOptions: FilterOption[];
  yearOptions: FilterOption[];
  languageOptions: FilterOption[];
  includeAdultOptions: FilterOption[];
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  isPending: boolean;
}

/**
 * SearchFilterBar Component
 * 
 * @param filters - Current filter state
 * @param typeOptions - Available search types
 * @param yearOptions - Available year options
 * @param languageOptions - Available language options
 * @param includeAdultOptions - Adult content options
 * @param onFilterChange - Callback when filter changes
 * @param onReset - Callback to reset all filters
 * @param isPending - Whether search is in progress
 */
export function SearchFilterBar({
  filters,
  typeOptions,
  yearOptions,
  languageOptions,
  includeAdultOptions,
  onFilterChange,
  onReset,
  isPending,
}: SearchFilterBarProps) {
  // Year filter is disabled for multi-search and person search
  const isYearDisabled = filters.type === "multi" || filters.type === "person";

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xl mx-auto p-4">
      <QueryInput
        value={filters.q}
        onChange={(value) => onFilterChange("q", value)}
        isLoading={isPending}
      />
      
      <div className="flex items-center gap-2 w-full justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="text-muted-foreground gap-1.5 h-9 px-3"
        >
          <RotateCcw className="h-4 w-4" />
          Reset All
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-4 bg-red-primary/10 text-red-primary border border-red-primary">
              <FunnelPlus size={22} />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Search Parameter Criteria</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col gap-5 mt-4">
              <TypeFilter
                value={filters.type}
                options={typeOptions}
                onChange={(value) => onFilterChange("type", value)}
              />

              <YearFilter
                value={isYearDisabled ? "" : filters.year}
                options={yearOptions}
                onChange={(value) => onFilterChange("year", value)}
                disabled={isYearDisabled}
              />

              <LanguageFilter
                value={filters.language}
                options={languageOptions}
                onChange={(value) => onFilterChange("language", value)}
              />

              <IncludeAdultFilter
                value={filters.includeAdult}
                options={includeAdultOptions}
                onChange={(value) => onFilterChange("includeAdult", value)}
              />
            </div>
            
            <div className="flex items-center justify-end mt-4 pt-4 border-t">
              <DialogClose asChild>
                <Button variant="secondary" className="px-5">View Results</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}