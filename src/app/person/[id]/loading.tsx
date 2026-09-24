/**
 * Person Detail Loading State
 * Shows skeleton UI while person details are fetching
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-black animate-pulse">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-neutral-900">
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-8 pb-12">
            <div className="flex gap-6 md:gap-10 items-end">
              {/* Profile picture skeleton */}
              <div className="hidden md:block w-48 lg:w-56 aspect-2/3 bg-neutral-800 rounded-lg shrink-0" />

              <div className="flex-1 max-w-2xl space-y-4">
                <div className="h-10 md:h-12 bg-neutral-800 rounded w-2/3" />
                <div className="flex gap-3">
                  <div className="h-5 w-24 bg-neutral-800 rounded" />
                  <div className="h-5 w-32 bg-neutral-800 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-800 rounded w-full" />
                  <div className="h-4 bg-neutral-800 rounded w-full" />
                  <div className="h-4 bg-neutral-800 rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Biography skeleton */}
        <section>
          <div className="h-8 w-32 bg-neutral-800 rounded mb-4" />
          <div className="space-y-2 max-w-4xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-neutral-800 rounded w-full" />
            ))}
            <div className="h-4 bg-neutral-800 rounded w-2/3" />
          </div>
        </section>

        {/* Known for skeleton */}
        <section>
          <div className="h-8 w-40 bg-neutral-800 rounded mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-40">
                <div className="w-40 aspect-2/3 bg-neutral-800 rounded-lg mb-2" />
                <div className="h-4 bg-neutral-800 rounded w-3/4 mb-1" />
                <div className="h-3 bg-neutral-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        </section>

        {/* Filmography skeleton */}
        <section>
          <div className="h-8 w-40 bg-neutral-800 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-3 bg-neutral-900 rounded-lg">
                <div className="w-16 h-24 bg-neutral-800 rounded shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-neutral-800 rounded w-1/3" />
                  <div className="h-3 bg-neutral-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}