'use server'

import { productRepo } from "@packages/server/features/products/repo"

export async function getProductAction (id: number) {
  const product = await productRepo.getById(id)
  return product
}