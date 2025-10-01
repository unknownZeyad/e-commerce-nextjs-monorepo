"use server"


import { categoryService } from "@packages/server/features/categories/services";
import { CreateCategoryPayload, createCategorySchema, UpdateCategoryPayload, updateCategorySchema } from "./validations";

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
