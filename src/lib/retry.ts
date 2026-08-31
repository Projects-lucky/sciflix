/**
 * Retry Utility
 * 
 * Implements exponential backoff retry logic for async operations.
 * Uses HTTP_CONFIG for retry settings and shouldRetry for error filtering.
 * 
 * @param fn - Async function to retry
 * @returns Promise resolving to the function result
 * @throws Last error if all retries fail or error is non-retryable
 */

import { HTTP_CONFIG } from "../constants/api";
import { sleep } from "./sleep";
import { shouldRetry } from "./shouldRetry";

export async function retry<T>(
  fn: () => Promise<T>
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= HTTP_CONFIG.retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Stop retrying if max attempts reached or error is not retryable
      if (
        attempt === HTTP_CONFIG.retries ||
        !shouldRetry(error)
      ) {
        throw error;
      }

      // Exponential backoff delay
      const delay =
        HTTP_CONFIG.baseDelay * Math.pow(2, attempt);

      await sleep(delay);
    }
  }

  throw lastError;
}