/**
 * Type Filter Component
 * 
 * Toggle group for selecting search type (multi, movie, tv, person).
 * Uses Shadcn ToggleGroup for single-selection behavior.
 * Enhanced with accessibility and visual feedback.
 */

'use client'

import { FilterOption } from '../types'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface TypeFilterProps {
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

/**
 * TypeFilter Component
 * 
 * @param value - Currently selected type
 * @param options - Available type options
 * @param onChange - Callback when type changes
 */
export function TypeFilter({ value, options, onChange }: TypeFilterProps) {
  /**
   * Handles toggle value change
   * Prevents empty selection by ignoring falsy values
   */
  const handleValueChange = (newValue: string) => {
    if (newValue) {
      onChange(newValue)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 dark:text-muted-foreground/90">
        Type
      </span>
      
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={handleValueChange}
        className="justify-start flex-wrap gap-1.5"
      >
        {options.map((option) => (
          <ToggleGroupItem 
            key={String(option.value)} 
            value={String(option.value)}
            variant="outline"
            className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 
                       data-[state=on]:bg-red-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm
                       hover:bg-red-primary/15 hover:text-muted-foreground"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}