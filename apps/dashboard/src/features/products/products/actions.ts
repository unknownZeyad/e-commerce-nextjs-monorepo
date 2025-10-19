'use server'

import { Product } from "@packages/server/features/products/model"
import { productRepo } from "@packages/server/features/products/repo"

export async function getProductsAction({ limit, page, filters }: { 
  page: number, 
  limit: number, 
  filters?: Partial<Product>
}) {
  return await productRepo.getAll(page, limit, filters)
}
