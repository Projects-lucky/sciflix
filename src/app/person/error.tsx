"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PersonDetailError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Person Error]", error);
  }, [error]);

  return (
    <ErrorState
      title="Person unavailable"
      description="We couldn't load this person's page. It may have been removed or the service is temporarily down."
      error={error}
      onReset={reset}
    />
  );
}
