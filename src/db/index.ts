/**
 * Drizzle Database Client
 * Single instance shared across the app.
 *
 * Uses DATABASE_URL (pooled) — the app runs on Vercel's serverless
 * infrastructure and needs PgBouncer to handle connection fan-out.
 *
 * For migrations, drizzle-kit uses DATABASE_URL_UNPOOLED (see drizzle.config.ts).
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// ============================================
// VALIDATION
// ============================================

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local (pooled Neon connection)",
  );
}

// ============================================
// CLIENT
// ============================================

/**
 * Neon HTTP driver — optimized for serverless.
 *
 * Why HTTP:
 * - No WebSocket handshake overhead per request
 * - Works natively on Vercel Edge + Node runtimes
 * - Single round-trip per query
 */
const sql = neon(process.env.DATABASE_URL);

/**
 * Drizzle instance with full schema type inference.
 *
 * Usage:
 *   import { db } from '@/db';
 *   const items = await db.select().from(watchlistItems);
 */
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from "./schema";
