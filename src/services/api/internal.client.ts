/**
 * Internal API Client
 * 
 * HTTP client for internal Next.js API routes (/api/*).
 * Handles authentication automatically via Clerk session cookies.
 * Provides GET, POST, and DELETE methods with consistent error handling.
 */

import { AppError } from "@/errors/AppError";
import { toastEvents } from "@/lib/toast-events";
import { HTTP_CONFIG } from "@/constants";

export class InternalApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = "/api";
  }

  /**
   * Core request method for internal API calls
   * 
   * @param endpoint - API endpoint path
   * @param method - HTTP method
   * @param body - Request body for POST requests
   * @returns Parsed JSON response
   * @throws AppError on failure
   */
  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "DELETE" = "GET",
    body?: any
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const rawText = await response.text();

      if (!response.ok) {
        let errorMessage = `Internal API request failed: ${response.status}`;
        try {
          const parsedError = JSON.parse(rawText);
          errorMessage = parsedError.error || parsedError.message || errorMessage;
        } catch {
          errorMessage = rawText || errorMessage;
        }

        toastEvents.emit({
          type: "error",
          message: `API Error (${response.status})`,
          description: errorMessage,
        });

        throw new AppError(response.status, errorMessage);
      }

      return rawText ? JSON.parse(rawText) : ({} as T);
    } catch (error) {
      if (error instanceof AppError) throw error;

      toastEvents.emit({
        type: "error",
        message: "Network Timeout",
        description: "Please check your internet connection and try again.",
      });

      throw new AppError(500, "Network error or invalid response");
    }
  }

  /**
   * Performs a GET request to the internal API
   * 
   * @param endpoint - API endpoint path
   * @returns Parsed JSON response
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "GET");
  }

  /**
   * Performs a POST request to the internal API
   * 
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @returns Parsed JSON response
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, "POST", data);
  }

  /**
   * Performs a DELETE request to the internal API
   * 
   * @param endpoint - API endpoint path
   * @returns Parsed JSON response
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "DELETE");
  }
}

export const internalApiClient = new InternalApiClient();