import { pgTable, timestamp, text, integer, serial } from "drizzle-orm/pg-core";

export const coffee = pgTable("coffee", {
  id: serial("id").primaryKey(),
  name: text("name"),
  price: integer("price"),
  origin: text("origin"),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});

export type coffeeType = typeof coffee.$inferSelect;
