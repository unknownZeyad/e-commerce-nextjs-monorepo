'use server'

import { productService } from "@packages/server/features/products/services";

export async function getProductAction (id: number, sku?: string) {
  const product = await productService.getById(id, sku)
  return product
}