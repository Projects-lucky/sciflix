"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PersonDetailError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Person Detail Error]", error);
  }, [error]);

  return (
    <ErrorState
      title="Person details unavailable"
      description="We couldn't load this person's profile. It may have been removed or the service is temporarily down."
      error={error}
      onReset={reset}
    />
  );
}
