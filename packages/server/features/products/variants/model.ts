import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  bigserial,
  index,
} from "drizzle-orm/pg-core";
import { productsTable } from "../model";

export const variantsTable = pgTable("product_variants", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  customSku: text("custom_sku"),
  defaultSku: text("default_sku").notNull(),
  orderCount: integer('order_count').notNull().default(0),
  productId: integer('productId').notNull().references(() => productsTable.id, {
    onDelete: "cascade", 
  }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  discountPercentage: real("discount_percentage").default(0).notNull(),
  images: text("images").array().default([]).notNull(),
  quantity: integer("quantity").default(0).notNull(),
  disabled: boolean().default(false).notNull(),
},(table) => ({
  productIdIdx: index("product_id_idx").on(table.productId),
}));
