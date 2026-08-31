/**
 * Filter Bar Component
 * 
 * Sidebar-based filter controls for movies and TV shows.
 * Includes genre selection, sorting, specifications, and regional options.
 * Displays active filter criteria and provides reset functionality.
 * Collapsible with icon-only mode for compact views.
 */

'use client'

import { GenreFilter } from './GenreFilter'
import { YearFilter } from './YearFilter'
import { RatingFilter } from './RatingFilter'
import { SortFilter } from './SortFilter'
import { LanguageFilter } from './LanguageFilter'
import { CountryFilter  } from './CountryFilter'
import { RuntimeFilter } from './RuntimeFilter'
import { IncludeAdultFilter } from './IncludeAdultFilter'
import { FilterActions } from './FilterActions'
import { FilterOption, FilterState } from './types'
import {
  SlidersHorizontal,
  ArrowUpDown,
  Clapperboard,
  Settings2,
  Globe,
  RotateCcw
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface FilterBarProps {
  filters: FilterState
  genreOptions: FilterOption[]
  yearOptions: FilterOption[]
  ratingOptions: FilterOption[]
  sortOptions: FilterOption[]
  languageOptions: FilterOption[]
  countryOptions: FilterOption[]
  runtimeOptions: FilterOption[]
  includeAdultOptions: FilterOption[]
  onFilterChange: (key: keyof FilterState, value: string | string[] | null) => void
  onReset: () => void
  isChanged: boolean
  type: 'movie' | 'tv'
}

/**
 * FilterBar Component
 * 
 * @param filters - Current filter state
 * @param genreOptions - Available genre options
 * @param yearOptions - Available year options
 * @param ratingOptions - Available rating options
 * @param sortOptions - Available sort options
 * @param languageOptions - Available language options
 * @param countryOptions - Available country options
 * @param runtimeOptions - Available runtime options
 * @param includeAdultOptions - Adult content options
 * @param onFilterChange - Callback when filter changes
 * @param onReset - Callback to reset filters
 * @param isChanged - Whether filters have been modified
 * @param type - Media type (movie or tv)
 */
export function FilterBar({
  filters,
  genreOptions,
  yearOptions,
  ratingOptions,
  sortOptions,
  languageOptions,
  countryOptions,
  runtimeOptions,
  includeAdultOptions,
  onFilterChange,
  onReset,
  isChanged,
  type,
}: FilterBarProps) {
  // Build label for active genre selection
  const selectedGenresLabel = filters.genre
    ? String(filters.genre)
        .split(',')
        .map(id => genreOptions.find(g => String(g.value) === id)?.label)
        .filter(Boolean)
        .join(', ')
    : ''

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" className='z-50'>
      <SidebarHeader className="p-4 border-b dark:border-gray-800 flex flex-row items-center gap-2 overflow-hidden">
        <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden whitespace-nowrap">
          <h2 className="text-lg font-semibold tracking-tight">Discovery Filters</h2>
          <p className="text-[11px] text-muted-foreground">
            {type === 'movie' ? 'Movies Catalog' : 'TV Shows Catalog'} • Page {filters.page}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 gap-3 overflow-x-hidden scrollbar-none">
        
        {/* Sorting Section */}
        <SidebarGroup className="p-2 gap-1.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sorting Options" className="pointer-events-none h-auto hover:bg-transparent p-2">
                <ArrowUpDown className="h-4 w-4 text-red-primary shrink-0" />
                <SidebarGroupLabel className="h-auto p-0 text-[11px] font-bold text-md uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                  Sorting & Priorities
                </SidebarGroupLabel>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroupContent className="group-data-[collapsible=icon]:hidden mt-1">
            <SortFilter
              value={filters.sort}
              options={sortOptions}
              onChange={(value) => onFilterChange('sort', value)}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-2" />

        {/* Genres Section */}
        <SidebarGroup className="p-2 gap-1.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Genres Selection" className="pointer-events-none p-0 h-auto hover:bg-transparent">
                <Clapperboard className="h-4 w-4 text-red-primary shrink-0" />
                <SidebarGroupLabel className="h-auto p-0 text-[11px] text-md font-bold uppercase tracking-wider text-gray-400 group-data-[collapsible=icon]:hidden">
                  Genres
                </SidebarGroupLabel>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroupContent className="group-data-[collapsible=icon]:hidden mt-1">
            <GenreFilter
              value={filters.genre}
              options={genreOptions}
              onChange={(value) => onFilterChange('genre', value)}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-2" />

        {/* Specifications Section */}
        <SidebarGroup className="p-2 gap-1.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Specifications" className="pointer-events-none p-0 h-auto hover:bg-transparent">
                <Settings2 className="h-4 w-4 text-red-primary shrink-0" />
                <SidebarGroupLabel className="h-auto p-0 text-[11px] text-md font-bold uppercase tracking-wider text-gray-400 group-data-[collapsible=icon]:hidden">
                  Specifications
                </SidebarGroupLabel>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroupContent className="group-data-[collapsible=icon]:hidden space-y-3 mt-1">
            <YearFilter
              value={filters.year}
              options={yearOptions}
              onChange={(value) => onFilterChange('year', value)}
            />

            <RatingFilter
              value={filters.rating}
              options={ratingOptions}
              onChange={(value) => onFilterChange('rating', value)}
            />

            <RuntimeFilter
              value={filters.runtime}
              options={runtimeOptions}
              onChange={(value) => onFilterChange('runtime', value)}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-2" />

        {/* Regional Options Section */}
        <SidebarGroup className="p-2 gap-1.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Regional Options" className="pointer-events-none p-0 h-auto hover:bg-transparent">
                <Globe className="h-4 w-4 text-red-primary shrink-0" />
                <SidebarGroupLabel className="h-auto p-0 text-[11px] text-md font-bold uppercase tracking-wider text-gray-400 group-data-[collapsible=icon]:hidden">
                  Regional Options
                </SidebarGroupLabel>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroupContent className="group-data-[collapsible=icon]:hidden space-y-3 mt-1">
            <LanguageFilter
              value={filters.language}
              options={languageOptions}
              onChange={(value) => onFilterChange('language', value)}
            />

            <CountryFilter
              value={filters.country}
              options={countryOptions}
              onChange={(value) => onFilterChange('country', value)}
            />

            <IncludeAdultFilter
              value={filters.includeAdult}
              options={includeAdultOptions}
              onChange={(value) => onFilterChange('includeAdult', value)}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 min-h-16 flex flex-col justify-center">
        {/* Expanded footer with active criteria */}
        <div className="group-data-[collapsible=icon]:hidden">
          {isChanged && (
            <div className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 p-2 rounded border mb-2 max-h-24 overflow-y-auto scrollbar-none">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Active Criteria:</span>
              {selectedGenresLabel && ` • Genre: ${selectedGenresLabel}`}
              {filters.year && ` • Year: ${filters.year}`}
              {filters.rating && ` • Rating: ${filters.rating}+`}
              {filters.language && ` • Lang: ${languageOptions.find(l => String(l.value) === filters.language)?.label}`}
              {filters.country && ` • Country: ${countryOptions.find(c => String(c.value) === filters.country)?.label}`}
              {filters.runtime && ` • Runtime: ${filters.runtime}+m`}
              {filters.includeAdult && filters.includeAdult !== 'false' && ` • Adult: Yes`}
              {filters.sort && filters.sort !== 'popularity.desc' && ` • Sort: ${sortOptions.find(s => String(s.value) === filters.sort)?.label}`}
            </div>
          )}
          <FilterActions onReset={onReset} isChanged={isChanged} />
        </div>

        {/* Compact footer with reset button only */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
          <button
            onClick={onReset}
            disabled={!isChanged}
            title="Reset active query filters"
            className="h-8 w-8 rounded-full flex items-center justify-center border bg-white dark:bg-gray-950 shadow-sm text-gray-500 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-500 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}