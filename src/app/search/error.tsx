'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/shared/error-state';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SearchError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[Search Error]', error);
  }, [error]);

  return (
    <ErrorState
      title="Search failed"
      description="We couldn't complete your search. Please try again."
      error={error}
      onReset={reset}
    />
  );
}