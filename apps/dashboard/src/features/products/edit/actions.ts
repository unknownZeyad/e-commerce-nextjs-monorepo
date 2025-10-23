'use server'
import { productService } from "@packages/server/features/products/services";

export async function getProductWithVariantsAction (productId: number) {
  return await productService.getProductByIdWithVariants(productId)
}