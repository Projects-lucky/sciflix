/**
 * Genre Filter Component
 * 
 * Multi-select toggle group for genre filtering.
 * Accepts comma-separated string from URL state and converts to array.
 * Ensures unique values and prevents duplicates.
 */

'use client'

import { FilterOption } from './types'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface GenreFilterProps {
  value: string 
  options: FilterOption[]
  onChange: (value: string[]) => void 
}

/**
 * GenreFilter Component
 * 
 * @param value - Comma-separated string of selected genre IDs
 * @param options - Available genre options
 * @param onChange - Callback with array of selected genre IDs
 */
export function GenreFilter({ value, options, onChange }: GenreFilterProps) {
  // Parse comma-separated string into unique array
  const arrayValue = Array.from(
    new Set(
      typeof value === 'string' && value 
        ? value.split(',').filter(Boolean)
        : []
    )
  )

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Genre
      </label>
      <ToggleGroup 
        type="multiple" 
        value={arrayValue} 
        onValueChange={(val) => {
          // Filter and deduplicate selected values
          const uniqueValues = Array.from(new Set(val.filter(Boolean)))
          onChange(uniqueValues)
        }}
        className="justify-start flex-wrap gap-1.5"
        variant="outline"
      >
        {options.map((option) => (
          <ToggleGroupItem 
            key={String(option.value)} 
            value={String(option.value)}
            aria-label={option.label}
            className="text-xs px-2.5 py-1 h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}