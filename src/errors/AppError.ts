/**
 * Application Error Class
 * 
 * Custom error class for consistent error handling across the application.
 * Extends native Error with HTTP status codes and optional error codes.
 */

export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}