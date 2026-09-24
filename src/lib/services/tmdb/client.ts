/**
 * TMDB HTTP Client
 * Server: Direct call to TMDB with token
 * Client: Goes through /api/tmdb proxy (token injected server-side)
 */

import { ENV, RETRY_CONFIG, TMDB_CONFIG } from '@/lib/config/app.config';

// ============================================
// TYPES
// ============================================

export interface TMDBClientOptions {
  timeout?: number;
  retryAttempts?: number;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

// ============================================
// CUSTOM ERROR
// ============================================

export class TMDBServiceError extends Error {
  public readonly status?: number;
  public readonly statusText?: string;
  public readonly data?: unknown;

  constructor(
    message: string,
    status?: number,
    statusText?: string,
    data?: unknown
  ) {
    super(message);
    this.name = 'TMDBServiceError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// ============================================
// UTILS
// ============================================

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// URL BUILDER (environment-aware)
// ============================================

function buildUrl(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const isServer = typeof window === 'undefined';

  // Server: direct to TMDB | Client: through our proxy
  const baseUrl = isServer
    ? TMDB_CONFIG.baseUrl
    : '/api/tmdb';

  // Client uses relative URL resolved against window.location
  const url = isServer
    ? new URL(`${baseUrl}${endpoint}`)
    : new URL(`${baseUrl}${endpoint}`, window.location.origin);

  // Language default
  if (!params.language) {
    url.searchParams.set('language', TMDB_CONFIG.defaultLanguage);
  }

  // Append params (skip undefined/null/empty)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

// ============================================
// MAIN CLIENT
// ============================================

export const tmdbClient = {
  async fetch<T>(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined> = {},
    options: TMDBClientOptions = {}
  ): Promise<T> {
    const url = buildUrl(endpoint, params);
    const maxAttempts = options.retryAttempts ?? RETRY_CONFIG.maxAttempts;
    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt < maxAttempts) {
      attempt++;

      try {
        return await this._executeFetch<T>(url, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (!this._shouldRetry(error, attempt, maxAttempts)) {
          throw lastError;
        }

        const delay = this._calculateBackoff(attempt);

        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[TMDB Client] Retry ${attempt}/${maxAttempts} for ${endpoint} after ${delay}ms`
          );
        }

        await sleep(delay);
      }
    }

    throw lastError || new Error('TMDB Client: All retry attempts failed');
  },

  async _executeFetch<T>(
    url: string,
    options: TMDBClientOptions
  ): Promise<T> {
    const timeout = options.timeout ?? RETRY_CONFIG.timeout;
    const isServer = typeof window === 'undefined';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      // Only attach token on the server — client relies on proxy
      if (isServer) {
        headers['Authorization'] = `Bearer ${ENV.tmdbAccessToken}`;
      }

      const fetchOptions: RequestInit = {
        method: 'GET',
        headers,
        signal: controller.signal,
        cache: options.cache ?? 'force-cache',
        next: options.next,
      };

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text().catch(() => null);
        }

        throw new TMDBServiceError(
          `TMDB API Error: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
          errorData
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof TMDBServiceError) throw error;

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TMDBServiceError(
          `Request timeout after ${timeout}ms`,
          408,
          'Timeout'
        );
      }

      throw new TMDBServiceError(
        error instanceof Error ? error.message : 'Unknown fetch error',
        500
      );
    } finally {
      clearTimeout(timeoutId);
    }
  },

  _shouldRetry(error: unknown, attempt: number, maxAttempts: number): boolean {
    if (attempt >= maxAttempts) return false;
    if (error instanceof TypeError) return true;

    if (error instanceof TMDBServiceError && error.status) {
      return RETRY_CONFIG.retryableStatusCodes.includes(
        error.status as 408 | 429 | 500 | 502 | 503 | 504
      );
    }

    return false;
  },

  _calculateBackoff(attempt: number): number {
    const { initialDelay, maxDelay, backoffMultiplier } = RETRY_CONFIG;
    let delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
    delay = Math.min(delay, maxDelay);
    const jitter = 1 + Math.random() * 0.2;
    return Math.floor(delay * jitter);
  },
};

export const { fetch: tmdbFetch } = tmdbClient;