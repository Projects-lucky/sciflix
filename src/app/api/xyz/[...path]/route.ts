// src/app/api/xyz/[...path]/route.ts

/**
 * TMDB API Proxy Route
 *
 * Forwards all requests to The Movie Database (TMDB) API.
 * Uses catch-all route parameters to proxy any TMDB endpoint.
 *
 * Environment variables required:
 *   - TMDB_ACCESS_TOKEN or TMDB_API_READ_ACCESS_TOKEN: API authentication token
 *   - NEXT_PUBLIC_TMDB_API_BASE_URL: TMDB API base URL (default: https://api.themoviedb.org/3)
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/xyz/[...path]
 *
 * Proxies GET requests to the TMDB API.
 *
 * @param request - Incoming Next.js request object
 * @param params - URL path parameters captured as array
 * @param params.path - Array of path segments from the request URL
 *
 * Example: /api/xyz/movie/550?language=en-US
 *   → Proxies to: https://api.themoviedb.org/3/movie/550?language=en-US
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const searchParams = request.nextUrl.searchParams.toString()

  // ✅ Get token and base URL from environment variables
  const token = process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_API_READ_ACCESS_TOKEN
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3'

  // ✅ Construct the full TMDB endpoint URL
  const targetUrl = `${baseUrl}/${path.join('/')}${searchParams ? `?${searchParams}` : ''}`

  // ✅ Log the target URL for debugging (remove in production)
  console.log('🔄 Proxying to:', targetUrl)

  try {
    // ✅ Forward request to TMDB with authentication
    const response = await fetch(targetUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    // ✅ Check if response is OK
    if (!response.ok) {
      console.error('❌ TMDB API Error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `TMDB API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error: any) {
    console.error('❌ Proxy Error:', error.message)
    return NextResponse.json(
      { error: error?.message || 'Proxy Connection Failed' },
      { status: 500 }
    )
  }
}