/**
 * Runtime Filter Component
 * 
 * Select dropdown for filtering by minimum runtime.
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

interface RuntimeFilterProps {
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

/**
 * RuntimeFilter Component
 * 
 * @param value - Currently selected runtime value (empty string for "any")
 * @param options - Available runtime options
 * @param onChange - Callback when runtime changes
 */
export function RuntimeFilter({ value, options, onChange }: RuntimeFilterProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Min Runtime (min)
      </label>
      
      <Select 
        value={value || "any"} 
        onValueChange={(val) => onChange(val === "any" ? "" : val)}
      >
        <SelectTrigger className="w-full h-9 text-xs border rounded-lg outline-none">
          <SelectValue placeholder="Any Runtime" />
        </SelectTrigger>
        
        <SelectContent>
          <SelectItem value="any" className="text-xs">
            Any Runtime
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