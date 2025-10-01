import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  AnyPgColumn
} from "drizzle-orm/pg-core";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  parentId: integer("parent_id").references(
    (): AnyPgColumn => categoriesTable.id,
    { onDelete: "cascade" }
  ),
  createdDate: timestamp("created_date").defaultNow().notNull(),
  updatedDate: timestamp("updated_date").defaultNow().notNull(),
  parentPath: text("path").notNull(), 
});

export type Category = typeof categoriesTable.$inferSelect;
export type InsertCategory = typeof categoriesTable.$inferInsert;