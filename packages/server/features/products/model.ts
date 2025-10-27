import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text('brand'),
  description: text("description").notNull(),
  price: real("price").notNull(),
  discountPercentage: real("discount_percentage").default(0).notNull(),
  quantity: integer("quantity").notNull().default(0),
  createdDate: timestamp("created_date", { mode: "string" })
    .defaultNow()
    .notNull(),
  updatedDate: timestamp("updated_date", { mode: "string" })
    .defaultNow()
    .notNull(),
  categoryFullPath: text("category_full_path").notNull(), 
  mainVariantId: integer("main_variant_id").notNull(),
  variants: jsonb("variants").$type<
    {
      name: string,
      values: string[]
    }[]
  >().default([]).notNull(),
});


export type Product = InferSelectModel<typeof productsTable>;
export type InsertProduct = InferInsertModel<typeof productsTable>;