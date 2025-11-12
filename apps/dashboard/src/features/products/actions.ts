'use server'

import { productService } from "@packages/server/features/products/services"

export async function deleteProductAction(id: number) {
  return await productService.getByIdWithVariants(id)
}