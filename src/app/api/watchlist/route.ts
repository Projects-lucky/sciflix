// app/api/watchlist/route.ts
/**
 * Watchlist API Routes
 * 
 * Provides CRUD operations for user watchlists:
 * - GET: Returns all watchlist items for authenticated user
 * - POST: Adds a new item to watchlist
 * - DELETE: Removes an item from watchlist
 * 
 * Authentication required for all endpoints.
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { watchlists } from '@/db/schema'
import { and, eq, desc } from 'drizzle-orm'
import { z } from 'zod'

const WatchlistSchema = z.object({
  mediaId: z.number(),
  mediaType: z.enum(['movie', 'tv']),
  title: z.string(),
  poster: z.string().nullable().optional(),
  rating: z.number().nullable().optional(),
  year: z.string().nullable().optional(),
})

/**
 * GET /api/watchlist
 * 
 * Fetches all watchlist items for the authenticated user.
 * Results are sorted by most recently added.
 */
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, userId))
      .orderBy(desc(watchlists.addedAt))

    return NextResponse.json(items)
  } catch (error) {
    console.error('GET watchlist error:', error)
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 })
  }
}

/**
 * POST /api/watchlist
 * 
 * Adds a new item to the user's watchlist.
 * Validates input, prevents duplicates, and sanitizes poster URLs.
 * 
 * Request body:
 *   - mediaId: TMDB media identifier
 *   - mediaType: 'movie' or 'tv'
 *   - title: Media title
 *   - poster: Full TMDB poster URL (optional)
 *   - rating: User rating (optional)
 *   - year: Release year (optional)
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    if (body && body.mediaId) body.mediaId = Number(body.mediaId);

    const validated = WatchlistSchema.parse(body)
    const dbMediaType = validated.mediaType === 'movie' ? 'MOVIE' : 'TV'

    // Extract only the path portion from TMDB poster URLs
    let cleanedPosterPath = validated.poster || null;
    if (cleanedPosterPath && cleanedPosterPath.includes('image.tmdb.org')) {
      const parts = cleanedPosterPath.split(/\/t\/p\/w\d+/);
      cleanedPosterPath = parts.length > 1 ? parts[1] : cleanedPosterPath;
    }

    // Check for existing entry
    const existing = await db
      .select()
      .from(watchlists)
      .where(
        and(
          eq(watchlists.userId, userId),
          eq(watchlists.mediaId, validated.mediaId),
          eq(watchlists.mediaType, dbMediaType)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Already in watchlist' }, { status: 400 })
    }

    const [newItem] = await db
      .insert(watchlists)
      .values({
        userId,
        mediaId: validated.mediaId,
        mediaType: dbMediaType,
        title: validated.title,
        poster: cleanedPosterPath,
        rating: validated.rating ? validated.rating.toString() : null,
        year: validated.year || null,
      })
      .onConflictDoNothing({ 
        target: [watchlists.userId, watchlists.mediaId, watchlists.mediaType] 
      })
      .returning()

    if (!newItem) {
      return NextResponse.json({ message: 'Already in your watchlist' }, { status: 200 })
    }

    return NextResponse.json(newItem, { status: 201 })

  } catch (error) {
    console.error('POST watchlist error:', error)
    return NextResponse.json(
      { error: 'Failed to add to watchlist' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/watchlist
 * 
 * Removes a specific item from the user's watchlist.
 * 
 * Query parameters:
 *   - mediaId: TMDB media identifier
 *   - mediaType: 'movie' or 'tv'
 */
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mediaId = parseInt(searchParams.get('mediaId') || '0')
    const incomingType = searchParams.get('mediaType')

    if (!mediaId || !incomingType || (incomingType !== 'movie' && incomingType !== 'tv')) {
      return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 })
    }

    const dbMediaType = incomingType === 'movie' ? 'MOVIE' : 'TV'

    await db
      .delete(watchlists)
      .where(
        and(
          eq(watchlists.userId, userId),
          eq(watchlists.mediaId, mediaId),
          eq(watchlists.mediaType, dbMediaType)
        )
      )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE watchlist error:', error)
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 })
  }
}