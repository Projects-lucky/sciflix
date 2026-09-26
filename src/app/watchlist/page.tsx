/**
 * Watchlist Page
 * Route: /watchlist
 *
 * Server Component:
 * - Requires signed-in user (redirects to sign-in if not)
 * - Fetches the user's watchlist
 * - Renders <WatchlistClient /> for the interactive tabs
 */

import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getWatchlist } from "@/db/queries";
import { WatchlistClient } from "./watchlist-client";

// ============================================
// METADATA (SEO + OpenGraph)
// ============================================

export const metadata: Metadata = {
  title: "My Watchlist",
  description:
    "Your personal collection of movies and TV shows — save for later, track what you have watched.",

  openGraph: {
    type: "website",
    title: "My Watchlist",
    description:
      "Your personal collection of movies and TV shows — save for later, track what you have watched.",
    url: "/watchlist",
  },

  twitter: {
    card: "summary",
    title: "My Watchlist",
    description:
      "Your personal collection of movies and TV shows — save for later, track what you have watched.",
  },

  // Private page — do not index
  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "/watchlist",
  },
};
// ============================================
// PAGE
// ============================================

export default async function WatchlistPage() {
  // Require auth — redirect to sign-in if not signed in
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch the user's watchlist (empty array if none)
  const items = await getWatchlist(userId);

  return (
    <div className="min-h-screen pt-3.5 pb-16">
      <div className="mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-semibold font-poppins">
              My Watchlist
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-poppins">
            {items.length === 0
              ? "Your watchlist is empty. Add movies and TV shows to get started."
              : `${items.length} ${items.length === 1 ? "item" : "items"} saved`}
          </p>
        </div>

        {/* Client component handles tabs + grid */}
        <WatchlistClient items={items} />
      </div>
    </div>
  );
}
