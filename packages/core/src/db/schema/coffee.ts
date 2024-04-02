import { pgTable, timestamp, text, integer, serial } from "drizzle-orm/pg-core";

export const coffees = pgTable("coffees", {
  id: serial("id").primaryKey(),
  name: text("name"),
  price: integer("price"),
  origin: text("origin"),
});

export type coffeeType = typeof coffees.$inferSelect;
