/**
 * Watchlist Page
 * 
 * Server component that displays the user's saved movies and TV shows.
 * Fetches watchlist items from the database using Drizzle ORM.
 * Redirects to sign-in if user is not authenticated.
 */

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { WatchlistClient } from './WatchlistClient'
import { db } from '@/db'
import { watchlists } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Watchlist',
  description: 'Movies and TV shows you want to watch later.',
}

/**
 * Watchlist Page Component
 * 
 * Fetches all watchlist items for the authenticated user.
 * Transforms database enum values to frontend-compatible format.
 * 
 * @returns Rendered watchlist page with user's saved items
 */
export default async function WatchlistPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Fetch all watchlist items for the user, sorted by most recently added
  const items = await db
    .select()
    .from(watchlists)
    .where(eq(watchlists.userId, userId))
    .orderBy(desc(watchlists.addedAt))

  // Transform database format to component format
  const transformedItems = items.map((item) => ({
    id: item.id,
    mediaId: item.mediaId,
    mediaType: item.mediaType.toLowerCase() as 'movie' | 'tv',
    title: item.title,
    poster: item.poster,
    rating: item.rating ? parseFloat(item.rating) : 0,
    year: item.year || 'N/A',
    addedAt: item.addedAt,
  }))

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="xs:text-xl md:text-2xl lg:text-3xl font-bold">My Watchlist</h1>
          <p className="text-muted-foreground text-sm mt-1 font-poppins">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      <WatchlistClient initialItems={transformedItems} />
    </main>
  )
}