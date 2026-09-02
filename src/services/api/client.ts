/**
 * API Client
 * 
 * Core HTTP client for making API requests with retry logic, timeout handling,
 * and error management. Uses TMDB_CONFIG for base URL and HTTP_CONFIG for retry settings.
 * Emits toast events for terminal failures after all retries are exhausted.
 */

import { TMDB_CONFIG, HTTP_CONFIG } from "@/constants";
import { AppError } from "@/errors/AppError";
import { retry } from "@/lib/retry";
import { withTimeout } from "@/lib/timeout";
import { toastEvents } from "@/lib/toast-events";

export class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = "api/xyz";
  }

  /**
   * Performs a GET request with retry and timeout
   * 
   * @param endpoint - API endpoint path
   * @param params - Query parameters
   * @param signal - AbortSignal for cancellation
   * @returns Parsed JSON response
   * @throws AppError on failure after all retries
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    signal?: AbortSignal,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);

    try {
      // Retry logic with exponential backoff
      return await retry(async () => {
        const response = await withTimeout(
          fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            signal: signal,
          }),
          HTTP_CONFIG.timeout || 3000,
        );

        const rawText = await response.text();

        if (!response.ok) {
          let errorMessage = `Upstream proxy response failure: ${response.status}`;
          try {
            const parsedError = JSON.parse(rawText);
            errorMessage =
              parsedError.error || parsedError.status_message || errorMessage;
          } catch {
            errorMessage = rawText || errorMessage;
          }
          throw new AppError(response.status, errorMessage);
        }

        try {
          return rawText ? JSON.parse(rawText) : ({} as T);
        } catch (e) {
          throw new AppError(
            response.status,
            `Client failed parsing payload logic. Snippet: ${rawText.substring(0, 80)}...`,
          );
        }
      });
    } catch (error) {
      // Terminal failure: all retries exhausted
      if (error instanceof AppError) {
        if (error.message.includes("parsing payload logic")) {
          toastEvents.emit({
            type: "warning",
            message: "Data Corruption Detected",
            description:
              "The application received bad structural data from our upstream provider.",
          });
        } else {
          toastEvents.emit({
            type: "error",
            message: `Connection Failed (${error.status})`,
            description: error.message,
            action:
              error.status === 401
                ? {
                    label: "Refresh Session",
                    onClick: () => window.location.reload(),
                  }
                : undefined,
          });
        }
      } else {
        toastEvents.emit({
          type: "error",
          message: "Network Timeout",
          description: "Please check your internet connection and try again.",
        });
      }

      throw error;
    }
  }

  /**
   * Builds a full URL with query parameters
   * 
   * @param endpoint - API endpoint path
   * @param params - Query parameters to append
   * @returns Full URL string
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const sanitizedBase = this.baseURL.replace(/\/$/, "");
    const sanitizedEndpoint = endpoint.replace(/^\//, "");
    const url = new URL(`${sanitizedBase}/${sanitizedEndpoint}`, origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }
}

export const apiClient = new ApiClient();