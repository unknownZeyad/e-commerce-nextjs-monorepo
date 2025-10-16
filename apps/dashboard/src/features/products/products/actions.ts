'use server'

import { ProductFilterKey, productRepo } from "@packages/server/features/products/repo"

export async function getProductsAction({ limit, page, query, queryKeys }: { 
  page: number, 
  limit: number, 
  query?: string, 
  queryKeys?: ProductFilterKey[]
}) {
  return await productRepo.getAll(page, limit, query, queryKeys)
}
