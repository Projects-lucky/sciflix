"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MovieError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Movie Browse Error]", error);
  }, [error]);

  return (
    <ErrorState
      title="Failed to load movies"
      description="We couldn't reach the movie catalogue. Please try again."
      error={error}
      onReset={reset}
    />
  );
}
