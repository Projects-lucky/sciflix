/**
 * withTimeout Utility
 * 
 * Wraps a promise with a timeout that rejects with an AppError if the timeout is exceeded.
 * Uses Promise.race to race the original promise against a timeout.
 * 
 * @param promise - The promise to wrap with a timeout
 * @param timeout - Timeout in milliseconds
 * @returns Promise resolving to the original promise result
 * @throws AppError with status 408 if timeout is exceeded
 */

import { AppError } from "@/errors/AppError";

export async function withTimeout<T>(
  promise: Promise<T>,
  timeout: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new AppError(408, "Request timed out"));
    }, timeout);
  });

  return Promise.race([promise, timeoutPromise]);
}