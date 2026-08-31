/**
 * Should Retry Utility
 * 
 * Determines whether an error should trigger a retry attempt.
 * Retries on timeout, rate limiting, and server errors.
 * Non-AppError instances default to true for retry.
 * 
 * @param error - The error to evaluate
 * @returns boolean indicating if retry should be attempted
 */

import { AppError } from "@/errors/AppError";

export function shouldRetry(error: unknown): boolean {
  // Retry all non-AppError errors
  if (!(error instanceof AppError)) {
    return true;
  }

  // Retry only specific HTTP status codes
  switch (error.status) {
    case 408: // Request Timeout
    case 429: // Too Many Requests
    case 500: // Internal Server Error
    case 502: // Bad Gateway
    case 503: // Service Unavailable
    case 504: // Gateway Timeout
      return true;

    default:
      return false;
  }
}