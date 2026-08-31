export function LoadingSkeleton() {
  return (
    <div className="animate-pulse rounded-lg overflow-hidden shadow-lg">
      <div className="aspect-2/3 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  )
}