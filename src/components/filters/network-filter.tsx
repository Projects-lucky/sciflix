/**
 * NetworkFilter Component
 * Dropdown to filter TV shows by network
 * Uses with_networks on TMDB discover/tv endpoint
 * TV only — movies don't have networks
 */

'use client';

import { useQueryStates } from 'nuqs';
import {
  discoverParsers,
  DISCOVER_OPTIONS,
} from '@/lib/search/nuqs-parsers';
import { NETWORK_OPTIONS } from '@/lib/config/filters.config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface NetworkFilterProps {
  className?: string;
  label?: string;
}

// ============================================
// COMPONENT
// ============================================

export function NetworkFilter({
  className,
  label = 'Network',
}: NetworkFilterProps) {
  const [{ withNetworks }, setFilters] = useQueryStates(
    discoverParsers,
    DISCOVER_OPTIONS
  );

  const currentValue =
    withNetworks !== undefined ? String(withNetworks) : 'all';

  const handleChange = (value: string) => {
    setFilters({
      withNetworks: value === 'all' ? null : Number(value),
      page: 1,
    });
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label
        htmlFor="network-filter"
        className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap"
      >
        {label}
      </label>
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger
          id="network-filter"
          className="w-44 h-9 bg-neutral-800 border-neutral-700 text-white text-sm"
        >
          <SelectValue placeholder="All Networks" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Networks</SelectItem>
          {NETWORK_OPTIONS.map((network) => (
            <SelectItem key={network.value} value={String(network.value)}>
              {network.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}