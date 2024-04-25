CREATE TABLE IF NOT EXISTS "cartItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"coffeeId" integer,
	"quantity" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coffees" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text,
	"name" text,
	"flavor" text,
	"roast" text,
	"price" integer,
	"origin" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text,
	"answer" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text,
	"name" text,
	"admin" boolean DEFAULT false,
	"image" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_coffeeId_coffees_id_fk" FOREIGN KEY ("coffeeId") REFERENCES "coffees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
