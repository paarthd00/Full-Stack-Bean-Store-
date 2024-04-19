import { pgTable, text, serial, uuid, integer } from "drizzle-orm/pg-core";

export const coffees = pgTable("coffees", {
  id: serial("id").primaryKey(),
  uuid: text("uuid"),
  name: text("name"),
  flavor: text("flavor"),
  roast: text("roast"),
  price: integer("price"),
  origin: text("origin"),
  image: text("image"),
});

export type coffeeType = typeof coffees.$inferSelect;
