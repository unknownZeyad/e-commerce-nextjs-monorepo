'use server'

import { productService } from "@packages/server/features/products/services";
import { addProductFormSchema } from "./schema"
import z from "zod"


const addProductSchema = addProductFormSchema.omit({
  category: true,
}).extend({
  category_full_path: z.string(),
})


export async function createProductAction(payload: z.infer<typeof addProductSchema>) {
  addProductSchema.parse(payload);

  const variants = Object.values(payload.variant_combinations).map(({
    price, quantity, enabled, defaultSku, customSku, discount_percentage, images
  }) => ({
    defaultSku, 
    price: +price,
    disabled: !enabled,
    quantity: +quantity,
    discountPercentage: +discount_percentage,
    customSku,
    images
  }))
  
  await productService.create({
    categoryFullPath: payload.category_full_path,
    description: payload.description,
    name: payload.name,
    price: +payload.price,
    quantity: +payload.quantity,
    discountPercentage: +payload.discount_percentage,
    variants: payload.variants,
    brand: payload.brand,
  },variants, payload.primary_variant_index);
}


