import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: text("uuid"),
  name: text("name"),
  admin: boolean("admin"),
  image: text("image"),
});

export type userType = typeof users.$inferSelect;
