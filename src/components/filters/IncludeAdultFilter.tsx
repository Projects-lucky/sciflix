/**
 * Include Adult Filter Component
 * 
 * Toggle control for including or excluding adult content.
 * Converts boolean toggle state to string values for URL compatibility.
 * Uses destructive styling when toggled off for visual clarity.
 */

'use client'

import { FilterOption } from '@/components/filters/types'
import { Toggle } from "@/components/ui/toggle"

interface IncludeAdultFilterProps {
  value: string
  options: FilterOption[] 
  onChange: (value: string) => void
}

/**
 * IncludeAdultFilter Component
 * 
 * @param value - Current filter value ('true' or 'false')
 * @param options - Available options (should contain true/false values)
 * @param onChange - Callback when toggle changes
 */
export function IncludeAdultFilter({ value, options, onChange }: IncludeAdultFilterProps) {
  const includeValue = String(options?.[0]?.value ?? "true")
  const excludeValue = String(options?.[1]?.value ?? "false")

  const isIncluded = value === includeValue

  const handleToggle = (pressed: boolean) => {
    onChange(pressed ? includeValue : excludeValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 dark:text-muted-foreground/90">
        Adult Rated
      </span>

      <Toggle
        pressed={isIncluded}
        onPressedChange={handleToggle}
        variant="outline"
        className="w-fit gap-2 px-4 py-2 font-medium transition-all duration-200 
                   data-[state=off]:bg-destructive/10 data-[state=off]:text-destructive data-[state=off]:border-destructive/30
                   hover:bg-muted"
        aria-label="Toggle adult content filter"
      >
        <span>18+</span>
      </Toggle>
    </div>
  )
}