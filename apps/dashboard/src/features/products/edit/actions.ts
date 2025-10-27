'use server'
import { productService } from "@packages/server/features/products/services";

export async function getProductWithVariantsAction (productId: number) {  
  console.log('the edit api is hitted')
  return await productService.getProductByIdWithVariants(productId)
}