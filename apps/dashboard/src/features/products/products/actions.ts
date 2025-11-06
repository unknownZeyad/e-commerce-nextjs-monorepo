'use server'

import { Product } from "@packages/server/features/products/model"
import { productService } from "@packages/server/features/products/services";

export async function getProductsAction({ limit, page, filters }: { 
  page: number, 
  limit: number, 
  filters?: Partial<Product>
}) {
  return await productService.getAll(page, limit, filters)
}
