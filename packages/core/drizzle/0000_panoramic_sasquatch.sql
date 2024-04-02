CREATE TABLE IF NOT EXISTS "coffee" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"price" integer,
	"origin" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faq" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text,
	"answer" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
