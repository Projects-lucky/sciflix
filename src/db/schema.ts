/**
 * Database Schema
 * 
 * Drizzle ORM schema definition for the watchlist table.
 * Uses PostgreSQL with pg-core for type-safe database operations.
 * Includes media type enum and optimized indexes for query performance.
 */

import { pgTable, uuid, text, integer, numeric, timestamp, uniqueIndex, index, pgEnum } from 'drizzle-orm/pg-core';

// Media type enum matching TMDB structures
export const mediaTypeEnum = pgEnum('media_type', ['MOVIE', 'TV']);

// Watchlist table definition
export const watchlists = pgTable(
  'watchlists',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    mediaId: integer('media_id').notNull(),
    mediaType: mediaTypeEnum('media_type').notNull(),
    title: text('title').notNull(),
    poster: text('poster'),
    rating: numeric('rating', { precision: 3, scale: 1 }),
    year: text('year'),
    addedAt: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Unique constraint: prevents duplicate entries for same user and media
    uniqueIndex('unique_user_media_idx').on(table.userId, table.mediaId, table.mediaType),
    
    // Standard index: optimizes queries filtering by userId
    index('user_id_idx').on(table.userId), 
  ]
);