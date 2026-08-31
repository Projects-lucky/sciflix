/**
 * Error Message Component
 * 
 * Displays an error message with a retry button.
 * Simple component for inline error handling.
 */

interface ErrorMessageProps {
  message: string
}

/**
 * ErrorMessage Component
 * 
 * @param message - Error message to display
 * @returns Rendered error message with retry button
 */
export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-center py-8">
      <p className="text-red-500">❌ {message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  )
}