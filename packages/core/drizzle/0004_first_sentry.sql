CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text,
	"name" text,
	"admin" boolean,
	"image" text
);
