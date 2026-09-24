CREATE TABLE "watchlist_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"tmdb_id" integer NOT NULL,
	"media_type" text NOT NULL,
	"title" text NOT NULL,
	"poster_path" text,
	"release_year" text,
	"status" text DEFAULT 'want_to_watch' NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"watched_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "watchlist_user_tmdb_unique" ON "watchlist_items" USING btree ("user_id","tmdb_id","media_type");--> statement-breakpoint
CREATE INDEX "watchlist_user_idx" ON "watchlist_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "watchlist_user_status_idx" ON "watchlist_items" USING btree ("user_id","status");