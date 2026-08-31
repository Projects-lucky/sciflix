/**
 * Formatting Utilities
 * 
 * Collection of helper functions for formatting dates, currencies, runtimes,
 * and media metadata. Also includes image URL builder and rating color utilities.
 */

// Date formatting
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'N/A'

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Year extractor
export function extractYear(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'
  return dateString.split('-')[0] || 'N/A'
}

// Runtime formatter (minutes → hours & minutes)
export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return 'N/A'

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes}m`
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}

// Currency formatter
export function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return 'N/A'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

// Build image URL
export function buildImageUrl(
  path: string | null | undefined,
  size: 'w45' | 'w92' | 'w185' | 'w342' | 'h632' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'
): string | null {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

// Get year from date string
export function getYearFromDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'
  return dateString.split('-')[0] || 'N/A'
}

// Truncate text
export function truncateText(text: string | null | undefined, maxLength: number = 200): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Returns a Tailwind color class based on the numerical rating
 */
export function getRatingColor(rating: number): string {
  if (rating >= 7.5) return 'text-green-500 border-green-500 '
  if (rating >= 6.0) return 'text-yellow-500 border-yellow-500'
  if (rating >= 4.0) return 'text-orange-500 border-orange-500'
  return 'text-red-500 border-red-500'
}

/**
 * Returns a duration category based on runtime and media type
 */
export function getDurationFormat(duration: number, mediaType: string): string {
  if (mediaType === 'movie') {
    if (duration < 90) return 'Short'
    if (duration < 120) return 'Medium'
    return 'Long'
  }
  if (mediaType === 'tv') {
    if (duration < 30) return 'Short'
    if (duration < 60) return 'Medium'
    return 'series'
  }
  return 'N/A'
}