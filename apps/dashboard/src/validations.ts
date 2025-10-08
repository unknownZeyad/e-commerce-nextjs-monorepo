import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  parentPath: z.string(),
  parentId: z.number().optional()
})

export const updateCategorySchema = createCategorySchema.omit({
  parentId: true,
  parentPath: true,
}).partial()

export type CreateCategoryPayload = z.infer<typeof createCategorySchema>
export type UpdateCategoryPayload = z.infer<typeof updateCategorySchema>

export const createProductSchema = z.object({
  name: z.string().min(3, "Product Name Must Be at least 3 Characters"),
  description: z.string().min(3, "Description Should Be 3 Characters"),
  price: z.number().refine(val => val > 0, "Price Must Be Greater Than 0"),
  discountPercentage: z.number().optional(),
  quantity: z.number().refine(val => val >= 0, "Price Must Be Greater Than Or Equal 0"),
  categoryFullPath: z.string().regex(/^(?:\d+\/)+$/, 'Category Full Path is not in a valid format'),
  variants: z.array(
    z.object({
      name: z.string().min(1, 'name Must be at least 1 '),
      linked_products: z.array(z.number()).refine(val => val.length > 0,'Variant must have at least 1 linked product')
    })
  )
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductPayload = z.infer<typeof createProductSchema>
export type UpdateProductPayload = z.infer<typeof updateProductSchema>
