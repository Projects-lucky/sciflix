'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/shared/error-state';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TVDetailError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[TV Detail Error]', error);
  }, [error]);

  return (
    <ErrorState
      title="TV show details unavailable"
      description="We couldn't load this TV show. It may have been removed or the service is temporarily down."
      error={error}
      onReset={reset}
    />
  );
}