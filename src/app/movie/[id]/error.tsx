'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/shared/error-state';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MovieDetailError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[Movie Detail Error]', error);
  }, [error]);

  return (
    <ErrorState
      title="Movie details unavailable"
      description="We couldn't load this movie. It may have been removed or the service is temporarily down."
      error={error}
      onReset={reset}
    />
  );
}