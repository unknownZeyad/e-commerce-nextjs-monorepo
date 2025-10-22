import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  password: text("password").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  birthDate: varchar("birth_date", { length: 20 }),
  createdDate: timestamp("created_date", { mode: "string" })
    .defaultNow()
    .notNull(),
});

export type User = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;