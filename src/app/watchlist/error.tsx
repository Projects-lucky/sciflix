"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WatchlistError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Watchlist Error]", error);
  }, [error]);

  return (
    <ErrorState
      title="Watchlist failed to load"
      description="We couldn't load your watchlist. Please try again."
      error={error}
      onReset={reset}
    />
  );
}
