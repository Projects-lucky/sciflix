/**
 * Sleep Utility
 * 
 * Returns a promise that resolves after the specified number of milliseconds.
 * Useful for creating delays in async operations, retry logic, and rate limiting.
 * 
 * @param ms - Number of milliseconds to sleep
 * @returns Promise that resolves after the delay
 */

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}