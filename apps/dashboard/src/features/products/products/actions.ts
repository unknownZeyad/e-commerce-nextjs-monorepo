'use server'

import { Product } from "@packages/server/features/products/model"
import { productService } from "@packages/server/features/products/services";

export async function getProductsAction({ limit, page, columns, filters }: { 
  page: number, 
  limit: number, 
  columns: (keyof Product)[]
  filters?: Partial<Product>
}) {
  return await productService.getAll(page, limit, columns, filters)
}
