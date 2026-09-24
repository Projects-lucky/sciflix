/**
 * Global Error Boundary
 * Catches unhandled errors from any route that doesn't define its own error.tsx.
 * Renders <ErrorState /> with a generic message.
 */

'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/shared/error-state';

// ============================================
// TYPES
// ============================================

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// ============================================
// COMPONENT
// ============================================

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log for monitoring (Sentry, Vercel, etc. can hook here later)
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <ErrorState
      title="Something went wrong"
      description="An unexpected error occurred. Please try again or return home."
      error={error}
      onReset={reset}
    />
  );
}