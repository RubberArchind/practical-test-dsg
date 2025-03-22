import { date, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const booksTable = pgTable("books", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  category: varchar().notNull(),
  publisher: varchar().notNull(),
  isbn: varchar().notNull().unique(),
  issn: varchar().notNull().unique(),
  author: varchar().notNull(),
  dateCreated: integer().notNull(),
  price: integer().notNull(),
  information: varchar().notNull(),
});

export const booksInsertSchema = createInsertSchema(booksTable);
