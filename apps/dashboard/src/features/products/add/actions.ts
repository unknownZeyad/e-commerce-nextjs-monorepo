'use server'

import { productService } from "@packages/server/features/products/services";
import { addProductSchema, AddProductPayload } from "../schema";

export async function createProductAction(payload: AddProductPayload) {
  addProductSchema.parse(payload);

  const variants = Object.values(payload.variants.combinations).map(({
    price, quantity, enabled, defaultSku, customSku, discount_percentage, images
  }) => ({
    price: +price,
    defaultSku, 
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
    brand: payload.brand, 
    variants: payload.variants.options.map((curr) => ({
      name: curr.name,
      values: curr.values.map(v => v.name)
    })),
  },variants, payload.variants.primary_variant_index);
}


