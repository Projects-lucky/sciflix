/**
 * Movie Browse Page - Loading Skeleton
 * Shown while the /movie route is loading.
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 animate-pulse">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header skeleton */}
        <div className="mb-6 space-y-2">
          <div className="h-9 w-40 bg-neutral-800 rounded" />
          <div className="h-4 w-64 bg-neutral-800 rounded" />
        </div>

        {/* Filter bar skeleton */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-neutral-900/50 md:flex-row md:items-center">
          <div className="h-9 w-full md:w-44 bg-neutral-800 rounded" />
          <div className="h-9 w-full md:w-44 bg-neutral-800 rounded" />
          <div className="h-9 w-full md:w-36 bg-neutral-800 rounded" />
          <div className="h-9 w-full md:w-32 bg-neutral-800 rounded" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-2/3 bg-neutral-800 rounded-lg mb-2" />
              <div className="h-4 bg-neutral-800 rounded w-3/4 mb-1" />
              <div className="h-3 bg-neutral-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}