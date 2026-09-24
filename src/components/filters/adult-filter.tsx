'use client';

import { useQueryStates } from 'nuqs';
import {
  searchParsers,
  discoverParsers,
  NUQS_OPTIONS,
  DISCOVER_OPTIONS,
} from '@/lib/search/nuqs-parsers';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type AdultFilterVariant = 'search' | 'discover';

export interface AdultFilterProps {
  variant?: AdultFilterVariant;
  className?: string;
  label?: string;
}

export function AdultFilter({
  variant = 'search',
  className,
  label = 'Include adult',
}: AdultFilterProps) {
  return variant === 'discover' ? (
    <DiscoverAdult className={className} label={label} />
  ) : (
    <SearchAdult className={className} label={label} />
  );
}

function SearchAdult({ className, label }: { className?: string; label: string }) {
  const [{ adult }, setFilters] = useQueryStates(searchParsers, NUQS_OPTIONS);
  return (
    <AdultToggle
      id="adult-filter-search"
      adult={adult}
      label={label}
      className={className}
      onChange={(checked) => setFilters({ adult: checked, page: 1 })}
    />
  );
}

function DiscoverAdult({ className, label }: { className?: string; label: string }) {
  const [{ adult }, setFilters] = useQueryStates(discoverParsers, DISCOVER_OPTIONS);
  return (
    <AdultToggle
      id="adult-filter-discover"
      adult={adult}
      label={label}
      className={className}
      onChange={(checked) => setFilters({ adult: checked, page: 1 })}
    />
  );
}

function AdultToggle({
  id,
  adult,
  label,
  className,
  onChange,
}: {
  id: string;
  adult: boolean;
  label: string;
  className?: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Switch
        id={id}
        checked={adult}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-orange-700"
      />
      <Label htmlFor={id} className="text-sm text-gray-300 cursor-pointer whitespace-nowrap">
        {label}
      </Label>
    </div>
  );
}