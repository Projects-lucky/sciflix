'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/shared/error-state';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TVError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[TV Browse Error]', error);
  }, [error]);

  return (
    <ErrorState
      title="Failed to load TV shows"
      description="We couldn't reach the TV catalogue. Please try again."
      error={error}
      onReset={reset}
    />
  );
}