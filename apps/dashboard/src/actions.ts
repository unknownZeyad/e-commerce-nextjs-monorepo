"use server"

import { categoryService } from "@packages/server/features/categories/services";
import { productRepo } from "@packages/server/features/products/repo";
import { CreateCategoryPayload, createCategorySchema, CreateProductPayload, UpdateCategoryPayload, updateCategorySchema } from "./validations";
import { Product } from "@packages/server/features/products/model";

export async function getSubCategoriesAction(parentPath?: string) {
  return await categoryService.getSubCategories(parentPath);
}

export async function getCategoriesFullPathAction(fullPath: string) {
  return await categoryService.getCategoriesFullPath(fullPath);
}

export async function createCategoryAction(
  payload: CreateCategoryPayload
) {
  createCategorySchema.parse(payload);
  const created = await categoryService.create(payload);
  return created;
}

export async function updateCategoryAction(
  id: number,
  payload: UpdateCategoryPayload
) {
  updateCategorySchema.parse(payload);
  const updated = await categoryService.updateById(id, payload);
  return updated;
}

export async function deleteCategoryAction(id: number) {
  await categoryService.deleteById(id);
}


export async function createProduct({ categoryFullPath, ...rest }: CreateProductPayload) {
  updateCategorySchema.parse({
    ...rest,
    categoryFullPath
  });
  const categoriesPath = await categoryService.getCategoriesFullPath(categoryFullPath)
  const categories = categoriesPath.map((c) => c.id) 

  await productRepo.create({
    categories,
    ...rest
  })
}


export async function getProductsAction({ limit, page, query, queryKeys}: { 
  page: number, 
  limit: number, 
  query?: string, 
  queryKeys?: (keyof Product)[]
}) {
  return await productRepo.getAll(page, limit, query, queryKeys)
}