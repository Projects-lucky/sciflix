/**
 * Country Filter Component
 * 
 * Select dropdown for filtering by origin country.
 * Uses "all" as a special value to represent empty selection.
 * Maps internal "all" value to empty string for API compatibility.
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

interface CountryFilterProps {
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

/**
 * CountryFilter Component
 * 
 * @param value - Currently selected country code (empty string for "all")
 * @param options - Available country options
 * @param onChange - Callback when country changes
 */
export function CountryFilter({ value, options, onChange }: CountryFilterProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Origin Country
      </label>
      
      <Select 
        value={value || "all"} 
        onValueChange={(val) => onChange(val === "all" ? "" : val)}
      >
        <SelectTrigger className="w-full h-9 text-xs border rounded-lg outline-none">
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        
        <SelectContent>
          <SelectItem value="all" className="text-xs">
            All Countries
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