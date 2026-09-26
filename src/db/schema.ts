/**
 * Drizzle Schema
 * Database tables for the watchlist feature.
 */

import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ============================================
// TYPES
// ============================================

export type MediaType = "movie" | "tv";
export type WatchlistStatus = "want_to_watch" | "watched";

// ============================================
// WATCHLIST ITEMS
// ============================================

export const watchlistItems = pgTable(
  "watchlist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),

    tmdbId: integer("tmdb_id").notNull(),
    mediaType: text("media_type").$type<MediaType>().notNull(),

    // Snapshot data (avoids TMDB calls on watchlist page)
    title: text("title").notNull(),
    posterPath: text("poster_path"),
    releaseYear: text("release_year"),

    // Status
    status: text("status")
      .$type<WatchlistStatus>()
      .notNull()
      .default("want_to_watch"),

    // Timestamps
    addedAt: timestamp("added_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    watchedAt: timestamp("watched_at", { withTimezone: true }),
  },
  (table) => ({
    userTmdbUnique: uniqueIndex("watchlist_user_tmdb_unique").on(
      table.userId,
      table.tmdbId,
      table.mediaType,
    ),
    userIdx: index("watchlist_user_idx").on(table.userId),
    userStatusIdx: index("watchlist_user_status_idx").on(
      table.userId,
      table.status,
    ),
  }),
);

// ============================================
// INFERRED TYPES
// ============================================

export type WatchlistItem = typeof watchlistItems.$inferSelect;
export type NewWatchlistItem = typeof watchlistItems.$inferInsert;
