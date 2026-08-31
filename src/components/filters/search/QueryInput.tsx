/**
 * Query Input Component
 * 
 * Search input field with loading state indicator.
 * Controlled component that synchronizes with parent state.
 * Displays search icon or loading spinner based on status.
 */

"use client";
import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

/**
 * QueryInput Component
 * 
 * @param value - Current input value
 * @param onChange - Callback when input value changes
 * @param isLoading - Whether to show loading spinner
 */
export function QueryInput({ value, onChange, isLoading }: QueryInputProps) {
  const [localValue, setLocalValue] = React.useState(value);

  // Sync local state with parent value
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-1 w-full max-w-xl">
      <label htmlFor="search-input" className="sr-only">
        Search for movies, TV shows, people
      </label>
      <div className="relative w-full">
        <Input
          id="search-input"
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder="Search for movies, TV shows, people..."
          className="pr-10 flex-1"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
      </div>
    </div>
  );
}