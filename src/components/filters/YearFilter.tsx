/**
 * Year Filter Component
 * 
 * Select dropdown for filtering by release year.
 * Uses "all" as a special value to represent empty selection.
 * Maps internal "all" value to empty string for API compatibility.
 * Supports disabled state for search types that don't support year filtering.
 */

'use client'

import { FilterOption } from './types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface YearFilterProps {
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  disabled?: boolean
}

/**
 * YearFilter Component
 * 
 * @param value - Currently selected year (empty string for "all")
 * @param options - Available year options
 * @param onChange - Callback when year changes
 * @param disabled - Whether the filter is disabled
 */
export function YearFilter({ value, options, onChange, disabled }: YearFilterProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 dark:text-muted-foreground/90">
        Year
      </span>
      
      <Select 
        value={value || "all"} 
        onValueChange={(val) => onChange(val === "all" ? "" : val)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full h-10 text-sm border rounded-md bg-background text-foreground transition-opacity focus:ring-2 focus:ring-ring disabled:opacity-40 disabled:cursor-not-allowed">
          <SelectValue placeholder="All Years" />
        </SelectTrigger>
        
        <SelectContent>
          <SelectItem value="all" className="text-sm">
            All Years
          </SelectItem>
          {options.map((option) => (
            <SelectItem 
              key={String(option.value)} 
              value={String(option.value)}
              className="text-sm"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}