/**
 * Error Boundary Component
 * 
 * React error boundary for catching and handling runtime errors in child components.
 * Prevents entire application crashes by displaying fallback UI.
 * Supports custom fallback and error logging callbacks.
 */

'use client'

import { Component, ReactNode } from 'react'
import { Button } from '../ui'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary Component
 * 
 * @param children - Child components to wrap
 * @param fallback - Custom fallback UI when error occurs
 * @param onError - Callback for error logging
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  /**
   * Updates state when an error occurs in child component
   * 
   * @param error - The caught error
   * @returns Updated state with error flag and error object
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /**
   * Logs error details when caught
   * 
   * @param error - The caught error
   * @param errorInfo - React error info with component stack
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="text-center m-auto">
            <p className="text-red-500 text-lg">Something went wrong</p>
            <p className="text-gray-500 text-sm mt-2">{this.state.error?.message}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-accent"
            >
              Reload Page
            </Button>
          </div>
        )
      )
    }

    return this.props.children
  }
}