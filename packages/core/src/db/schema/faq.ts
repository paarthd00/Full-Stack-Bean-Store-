import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question"),
  answer: text("answer"),
});

export type faqType = typeof faqs.$inferSelect;
