/**
 * Not Found (404)
 * Shown when a route doesn't match or notFound() is called.
 */

import { Film, Home, Search, Tv } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_META } from "@/lib/config/nav.config";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Film className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>

        {/* Big 404 */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Page not found
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Primary actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search" className="gap-2">
              <Search className="w-4 h-4" />
              Search
            </Link>
          </Button>
        </div>

        {/* Secondary browse links */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">
            Or explore {APP_META.name}
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link
              href="/movie"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Film className="w-4 h-4" />
              Movies
            </Link>
            <Link
              href="/tv"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Tv className="w-4 h-4" />
              TV Shows
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
