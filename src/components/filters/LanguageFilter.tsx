/**
 * Language Filter Component
 * 
 * Select dropdown for filtering by original language.
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

interface LanguageFilterProps {
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

/**
 * LanguageFilter Component
 * 
 * @param value - Currently selected language code (empty string for "all")
 * @param options - Available language options
 * @param onChange - Callback when language changes
 */
export function LanguageFilter({ value, options, onChange }: LanguageFilterProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 dark:text-muted-foreground/90">
        Language
      </span>
      
      <Select 
        value={value || "all"} 
        onValueChange={(val) => onChange(val === "all" ? "" : val)}
      >
        <SelectTrigger className="w-full h-10 text-sm border rounded-md bg-background text-foreground transition-opacity focus:ring-2 focus:ring-ring outline-none">
          <SelectValue placeholder="All Languages" />
        </SelectTrigger>
        
        <SelectContent>
          <SelectItem value="all" className="text-sm">
            All Languages
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