/**
 * ErrorState Component
 * Shared UI for all error boundaries.
 *
 * Used by:
 *   - src/app/error.tsx
 *   - src/app/movie/error.tsx
 *   - src/app/movie/[id]/error.tsx
 *   - ...and every other route's error boundary
 */

'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error & { digest?: string };
  onReset?: () => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this page. Please try again or go back home.",
  error,
  onReset,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'min-h-[60vh] flex items-center justify-center px-4 py-16',
        className
      )}
    >
      <div className="max-w-md text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {onReset && (
            <Button onClick={onReset} className="min-w-[110px]">
              Try Again
            </Button>
          )}
          <Button asChild variant="outline" className="min-w-[110px]">
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        {/* Dev-only error details */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left text-xs text-muted-foreground border border-border rounded-lg overflow-hidden">
            <summary className="cursor-pointer px-3 py-2 hover:bg-muted/50">
              Error details (dev only)
            </summary>
            <pre className="p-3 bg-muted/30 overflow-auto whitespace-pre-wrap break-words">
              {error.message}
              {error.digest ? `\n\nDigest: ${error.digest}` : ''}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}