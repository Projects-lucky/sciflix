/**
 * Next.js 16 Proxy (Merged)
 * - TMDB proxy: rewrites /api/tmdb/* → https://api.themoviedb.org/3/*
 *                injects Bearer token server-side (never exposed to browser)
 * - Clerk:      provides auth context to the app
 *
 * Order matters:
 *   1. Clerk wraps everything first (so auth state is available)
 *   2. TMDB check runs inside — if path matches /api/tmdb/*, we handle it
 *   3. Otherwise, fall through to Clerk's default handling
 *
 * Reference:
 *   - https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 *   - https://clerk.com/docs/nextjs/getting-started/quickstart
 */

import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================
// CONSTANTS
// ============================================

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_PREFIX = '/api/tmdb';

// ============================================
// TMDB PROXY HANDLER
// Returns a Response if the request was handled, otherwise null
// ============================================

function handleTmdbProxy(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl;

  // Only handle /api/tmdb/*
  if (!pathname.startsWith(TMDB_PREFIX)) {
    return null;
  }

  // Extract the TMDB path (everything after /api/tmdb)
  const tmdbPath = pathname.slice(TMDB_PREFIX.length);
  const tmdbUrl = `${TMDB_BASE}${tmdbPath}${search}`;

  // Verify token exists
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    console.error('[proxy] TMDB_ACCESS_TOKEN is not set');
    return NextResponse.json(
      { error: 'Server misconfigured' },
      { status: 500 }
    );
  }

  // Clone headers and inject Authorization
  const headers = new Headers(request.headers);
  headers.set('Authorization', `Bearer ${token}`);
  headers.delete('host'); // Prevent host header mismatch on rewrite

  // Rewrite to TMDB (headers propagate upstream)
  return NextResponse.rewrite(new URL(tmdbUrl), {
    request: { headers },
  });
}

// ============================================
// MERGED PROXY (Clerk + TMDB)
// ============================================

export default clerkMiddleware(async (_auth, request) => {
  // ─────────────────────────────────────────
  // 1. Try TMDB proxy first
  // ─────────────────────────────────────────
  const tmdbResponse = handleTmdbProxy(request);
  if (tmdbResponse) {
    return tmdbResponse;
  }

  // ─────────────────────────────────────────
  // 2. Otherwise, let Clerk handle it
  // ─────────────────────────────────────────
  return NextResponse.next();
});

// ============================================
// MATCHER CONFIG
// Runs on all routes except static assets & Next.js internals
// Required by Clerk to properly track session state across the app
// ============================================

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};