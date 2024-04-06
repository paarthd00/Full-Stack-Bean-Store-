CREATE TABLE IF NOT EXISTS "coffees" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"flavor" text,
	"roast" text,
	"origin" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text,
	"answer" text
);
