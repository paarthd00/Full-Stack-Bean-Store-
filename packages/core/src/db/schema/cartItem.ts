import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { users } from "./user";
import { coffees } from "./coffee";

export const cartItems = pgTable("cartItems", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
  coffeeId: integer("coffeeId").references(() => coffees.id, {
    onDelete: "cascade",
  }),
  quantity: integer("quantity"),
});

export type faqType = typeof cartItems.$inferSelect;
