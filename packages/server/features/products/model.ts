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
  description: text("description").notNull(),
  price: real("price").notNull(),
  discountPercentage: real("discount_percentage").default(0),
  images: text("images").array().default([]).notNull(),
  quantity: integer("quantity").notNull().default(0),
  createdDate: timestamp("created_date", { mode: "string" })
    .defaultNow()
    .notNull(),
  updatedDate: timestamp("updated_date", { mode: "string" })
    .defaultNow()
    .notNull(),
  categoryFullPath: text("category_full_path").notNull(), 
  variants: jsonb("variants").$type<
    {
      name: string,
      linked_products:{
        value: string,
        id: number
      }[]
    }[]
  >().default([]).notNull(),
});


export type Product = InferSelectModel<typeof productsTable>;
export type InsertProduct = InferInsertModel<typeof productsTable>;