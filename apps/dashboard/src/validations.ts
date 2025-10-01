import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  parentPath: z.string(),
  parentId: z.number().optional()
})

export const updateCategorySchema = z.object({
  name: z.string().min(2).max(50),
})

export type CreateCategoryPayload = z.infer<typeof createCategorySchema>
export type UpdateCategoryPayload = z.infer<typeof updateCategorySchema>