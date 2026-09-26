/**
 * Search Loading State
 * Skeleton shown during search fetch
 */

export default function Loading() {
  // Pre-generate a static list of 18 unique skeleton objects to satisfy the linter
  const skeletons = Array.from({ length: 18 }, (_, i) => ({
    id: `search-skeleton-item-${i}`,
  }));

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 animate-pulse">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Search bar skeleton */}
        <div className="h-11 bg-neutral-800 rounded w-full" />

        {/* Filters skeleton */}
        <div className="flex flex-wrap items-center gap-3 mt-4 p-4 bg-neutral-900/50 rounded-lg">
          <div className="h-9 w-28 bg-neutral-800 rounded" />
          <div className="h-9 w-32 bg-neutral-800 rounded" />
          <div className="h-9 w-32 bg-neutral-800 rounded" />
        </div>

        {/* Results header skeleton */}
        <div className="mt-6 space-y-2">
          <div className="h-7 w-48 bg-neutral-800 rounded" />
          <div className="h-4 w-64 bg-neutral-800 rounded" />
        </div>

        {/* Results grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
          {skeletons.map((item) => (
            <div key={item.id}>
              <div className="w-full -aspect-2/3 bg-neutral-800 rounded-lg mb-2" />
              <div className="h-94 bg-neutral-800 rounded w-3/4 mb-1" />
              <div className="h-3 bg-neutral-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
