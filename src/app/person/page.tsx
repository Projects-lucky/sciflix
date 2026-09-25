/**
 * People Browse Page - Server Component
 * Route: /person
 *
 * Lists popular people (actors, directors, etc.) with infinite scroll.
 * No filters — TMDB's /person/popular endpoint doesn't support them.
 */
export const dynamic = 'force-dynamic';


import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PersonClient } from "./person-client";

// ============================================
// METADATA (SEO + OpenGraph)
// ============================================

export const metadata: Metadata = {
  title: "People",
  description:
    "Browse popular actors, directors, and creators. Discover the people behind your favorite movies and TV shows.",

  openGraph: {
    type: "website",
    title: "People",
    description:
      "Browse popular actors, directors, and creators. Discover the people behind your favorite movies and TV shows.",
    url: "/person",
  },

  twitter: {
    card: "summary",
    title: "People",
    description:
      "Browse popular actors, directors, and creators. Discover the people behind your favorite movies and TV shows.",
  },

  alternates: {
    canonical: "/person",
  },
};

// ============================================
// PAGE
// ============================================

export default function PeoplePage() {
  return (
    <div className="min-h-screen pt-3.5 pb-16">
      <div className="mx-auto px-4">
        {/* Header */}
        <div className="mb-8 w-full">
          <div className="flex flex-col items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-poppins font-light capitalize tracking-wide">
              People
            </h1>
            <p className="text-sm text-muted-foreground font-poppins font-light capitalize tracking-wide">
              Popular actors, directors, and creators
            </p>
          </div>
        </div>

        {/* Client grid with infinite scroll */}
        <PersonClient />
      </div>
    </div>
  );
}
