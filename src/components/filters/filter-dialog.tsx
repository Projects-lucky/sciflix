"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { MediaType } from "@/lib/config/filters.config";
import { AdultFilter } from "./adult-filter";
import { CertificationFilter } from "./certification-filter";
import { DateRangeFilter } from "./date-range-filter";
import { GenreFilter } from "./genre-filter";
import { LanguageFilter } from "./language-filter";
import { NetworkFilter } from "./network-filter";
import { OriginCountryFilter } from "./origin-country-filter";
import { OriginalLanguageFilter } from "./original-language-filter";
import { ResetFiltersButton } from "./reset-filters-button";
import { SortFilter } from "./sort-filter";
import { VoteAverageFilter } from "./vote-average-filter";
import { YearFilter } from "./year-filter";

// ============================================
// TYPES
// ============================================

export interface FilterDialogProps {
  type: MediaType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============================================
// COMPONENT
// ============================================

export function FilterDialog({ type, open, onOpenChange }: FilterDialogProps) {
  const isMovie = type === "movie";
  const isTV = type === "tv";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>
            Refine results by genre, sort, language, and more.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Basics */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Basics
            </h3>

            <FilterField>
              <GenreFilter type={type} />
            </FilterField>

            <FilterField>
              <SortFilter type={type} />
            </FilterField>

            <FilterField>
              <LanguageFilter variant="discover" />
            </FilterField>

            <FilterField>
              <AdultFilter variant="discover" />
            </FilterField>
          </section>

          <Separator />

          {/* Advanced */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Advanced
            </h3>

            <FilterField>
              <OriginCountryFilter />
            </FilterField>

            <FilterField>
              <OriginalLanguageFilter />
            </FilterField>

            <FilterField>
              <VoteAverageFilter />
            </FilterField>

            <FilterField>
              <YearFilter type={type} />
            </FilterField>

            <FilterField>
              <DateRangeFilter
                type={type}
                label={isMovie ? "Release Range" : "Air Date Range"}
              />
            </FilterField>

            {isTV && (
              <FilterField>
                <NetworkFilter />
              </FilterField>
            )}

            {isMovie && (
              <FilterField>
                <CertificationFilter />
              </FilterField>
            )}
          </section>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <ResetFiltersButton variant="discover" forceShow />
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// FILTER FIELD WRAPPER
// ============================================

function FilterField({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 [&_label]:text-xs [&_label]:text-muted-foreground [&_label]:uppercase [&_label]:tracking-wider">
      {children}
    </div>
  );
}
