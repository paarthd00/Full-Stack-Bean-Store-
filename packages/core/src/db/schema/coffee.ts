import { pgTable, timestamp, text, integer, serial } from "drizzle-orm/pg-core";

export const coffees = pgTable("coffees", {
  id: serial("id").primaryKey(),
  name: text("name"),
  price: integer("price"),
  origin: text("origin"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export type coffeeType = typeof coffees.$inferSelect;
