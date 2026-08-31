/**
 * Sort Filter Component
 * 
 * Select dropdown for sorting search results.
 * Options are provided by parent component based on media type.
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

interface SortFilterProps {
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

/**
 * SortFilter Component
 * 
 * @param value - Currently selected sort option
 * @param options - Available sort options
 * @param onChange - Callback when sort changes
 */
export function SortFilter({ value, options, onChange }: SortFilterProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Sort By
      </label>
      
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full h-9 text-xs border rounded-lg outline-none">
          <SelectValue />
        </SelectTrigger>
        
        <SelectContent>
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