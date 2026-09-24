/**
 * People Page Loading State
 * Skeleton with circular avatar placeholders
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 animate-pulse">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header skeleton */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-neutral-800 rounded" />
            <div className="h-9 w-32 bg-neutral-800 rounded" />
          </div>
          <div className="h-4 w-56 bg-neutral-800 rounded" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {/* Circular avatar */}
              <div className="w-full aspect-square rounded-full bg-neutral-800" />
              {/* Name */}
              <div className="h-4 bg-neutral-800 rounded w-3/4" />
              {/* Role */}
              <div className="h-3 bg-neutral-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}