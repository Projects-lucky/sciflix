CREATE TYPE "public"."media_type" AS ENUM('MOVIE', 'TV');--> statement-breakpoint
CREATE TABLE "watchlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"media_id" integer NOT NULL,
	"media_type" "media_type" NOT NULL,
	"title" text NOT NULL,
	"poster" text,
	"rating" numeric(3, 1),
	"year" text,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_media_idx" ON "watchlists" USING btree ("user_id","media_id","media_type");--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_idx" ON "watchlists" USING btree ("user_id");