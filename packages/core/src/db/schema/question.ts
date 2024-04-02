import { pgTable, timestamp, text, serial } from "drizzle-orm/pg-core";

export const faq = pgTable("faq", {
  id: serial("id").primaryKey(),
  question: text("question"),
  answer: text("answer"),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});

export type faqType = typeof faq.$inferSelect;
