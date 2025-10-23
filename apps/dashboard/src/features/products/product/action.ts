'use server'

import { productService } from "@packages/server/features/products/services";

export async function getProductAction (id: number) {
  const product = await productService.getById(id)
  return product
}