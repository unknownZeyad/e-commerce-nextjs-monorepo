'use server'

import { categoryService } from "@packages/server/features/categories/services";
import z from "zod";

const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  parentPath: z.string(),
  parentId: z.number().optional()
})

const updateCategorySchema = createCategorySchema.omit({
  parentId: true,
  parentPath: true,
}).partial()

export async function getSubCategoriesAction(parentPath?: string) {
  return await categoryService.getSubCategories(parentPath);
}

export async function getCategoriesFullPathAction(fullPath: string) {
  return await categoryService.getCategoriesFullPath(fullPath);
}

export async function createCategoryAction(
  payload: z.infer<typeof createCategorySchema>
) {
  createCategorySchema.parse(payload);
  const created = await categoryService.create(payload);
  return created;
}

export async function updateCategoryAction(
  id: number,
  payload: z.infer<typeof updateCategorySchema>
) {
  updateCategorySchema.parse(payload);
  const updated = await categoryService.updateById(id, payload);
  return updated;
}

export async function deleteCategoryAction(id: number) {
  await categoryService.deleteById(id);
}

