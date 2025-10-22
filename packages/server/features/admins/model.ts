import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const adminsTable = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 20 }).notNull().unique(),
  password: text("password").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  birthDate: varchar("birth_date", { length: 20 }),
  profileImage: varchar("profile_image", { length: 20 }),
  isSuper: boolean('is_super').default(false).notNull(),
  tokenVersion: integer('token_version').default(1).notNull()
});

export type Admin = InferSelectModel<typeof adminsTable>;
export type InsertAdmin = InferInsertModel<typeof adminsTable>;