/**
 * Movie Detail Loading State
 * Shows skeleton UI while movie details are fetching
 */

// Static keys to satisfy the linter (no index in JSX)
const CAST_KEYS = Array.from({ length: 6 }, (_, i) => `cast-${i}`);
const DETAIL_KEYS = Array.from({ length: 8 }, (_, i) => `detail-${i}`);
const SIMILAR_KEYS = Array.from({ length: 6 }, (_, i) => `similar-${i}`);

export default function Loading() {
  return (
    <div className="min-h-screen bg-black animate-pulse">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-neutral-900">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-8 pb-12 md:pb-16">
            <div className="flex gap-6 md:gap-8 items-end">
              {/* Poster skeleton */}
              <div className="hidden md:block w-48 lg:w-56 aspect-2/3 bg-neutral-800 rounded-lg shrink-0" />

              {/* Info skeleton */}
              <div className="flex-1 max-w-2xl space-y-4">
                {/* Title */}
                <div className="h-10 md:h-12 bg-neutral-800 rounded w-3/4" />

                {/* Metadata row */}
                <div className="flex gap-3">
                  <div className="h-5 w-16 bg-neutral-800 rounded" />
                  <div className="h-5 w-20 bg-neutral-800 rounded" />
                  <div className="h-5 w-24 bg-neutral-800 rounded" />
                </div>

                {/* Overview */}
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-800 rounded w-full" />
                  <div className="h-4 bg-neutral-800 rounded w-full" />
                  <div className="h-4 bg-neutral-800 rounded w-2/3" />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <div className="h-10 w-32 bg-neutral-800 rounded-lg" />
                  <div className="h-10 w-40 bg-neutral-800 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Cast skeleton */}
        <section>
          <div className="h-8 w-32 bg-neutral-800 rounded mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {CAST_KEYS.map((key) => (
              <div key={key} className="shrink-0 w-32">
                <div className="w-32 h-32 bg-neutral-800 rounded-full mb-2" />
                <div className="h-4 bg-neutral-800 rounded w-3/4 mx-auto mb-1" />
                <div className="h-3 bg-neutral-800 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </section>

        {/* Details skeleton */}
        <section>
          <div className="h-8 w-40 bg-neutral-800 rounded mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DETAIL_KEYS.map((key) => (
              <div key={key} className="space-y-2">
                <div className="h-4 bg-neutral-800 rounded w-1/2" />
                <div className="h-4 bg-neutral-800 rounded w-3/4" />
              </div>
            ))}
          </div>
        </section>

        {/* Similar movies skeleton */}
        <section>
          <div className="h-8 w-40 bg-neutral-800 rounded mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {SIMILAR_KEYS.map((key) => (
              <div key={key} className="shrink-0 w-40">
                <div className="w-40 aspect-2/3 bg-neutral-800 rounded-lg mb-2" />
                <div className="h-4 bg-neutral-800 rounded w-3/4 mb-1" />
                <div className="h-3 bg-neutral-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
