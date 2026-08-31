/**
 * Filter Actions Component
 * 
 * Reset button for filter controls.
 * Disabled when no filters have been changed.
 * Includes rotation animation on focus.
 */

'use client'
import { RotateCcw } from 'lucide-react';

interface FilterActionsProps {
  onReset: () => void
  isChanged?: boolean
}

/**
 * FilterActions Component
 * 
 * @param onReset - Callback to reset filters
 * @param isChanged - Whether filters have been modified from defaults
 */
export function FilterActions({ onReset, isChanged = false }: FilterActionsProps) {
  return (
    <div className="flex items-center flex-row gap-1">
      <button
        onClick={onReset}
        disabled={!isChanged}
        className="p-1.5 text-sm flex items-center flex-row group gap-1 font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
      >
       <RotateCcw size={16} className='group-focus:rotate-90 transition-all'/> Reset
      </button>
    </div>
  )
}