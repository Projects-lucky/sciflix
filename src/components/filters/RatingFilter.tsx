/**
 * Rating Filter Component
 * 
 * Select dropdown for filtering by minimum rating.
 * Uses "any" as a special value to represent empty selection.
 * Maps internal "any" value to empty string for API compatibility.
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

interface RatingFilterProps {
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

/**
 * RatingFilter Component
 * 
 * @param value - Currently selected rating value (empty string for "any")
 * @param options - Available rating options
 * @param onChange - Callback when rating changes
 */
export function RatingFilter({ value, options, onChange }: RatingFilterProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Minimum Rating
      </label>
      
      <Select 
        value={value || "any"} 
        onValueChange={(val) => onChange(val === "any" ? "" : val)}
      >
        <SelectTrigger className="w-full h-9 text-xs border rounded-lg outline-none">
          <SelectValue placeholder="Any Rating" />
        </SelectTrigger>
        
        <SelectContent>
          <SelectItem value="any" className="text-xs">
            Any Rating
          </SelectItem>
          {options.map((option) => (
            <SelectItem 
              key={String(option.value)} 
              value={String(option.value)}
              className="text-xs"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}