/**
 * Dedupe by ID Helper
 * 
 * Removes duplicate items from an array based on ID and optional mediaType.
 * Creates a composite key using both mediaType and ID to differentiate
 * between movies and TV shows with the same ID.
 * 
 * @param items - Array of items with id and optional mediaType
 * @returns Deduplicated array
 */

export function dedupeById<T extends { id: number; mediaType?: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = item.mediaType ? `${item.mediaType}-${item.id}` : String(item.id)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}