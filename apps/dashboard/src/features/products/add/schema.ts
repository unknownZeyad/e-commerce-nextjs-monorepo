
import { numberValidation, positiveNumberValidation } from "@/core/lib/validations";
import z from "zod";
import { ZodIssueCode } from "zod/v3";


export const addProductFormSchema = z.object({
  name: z.string().refine(v => v.length > 3, 'Product Name Must Be More than 3 Characters.'),
  brand: z.string().refine(v => v.length > 3, 'Brand Name Must Be More than 3 Characters.'),
  description: z.string().refine(v => v.length > 3, 'Product Description Must Be More than 3 Characters.'),
  price: numberValidation,
  discount_percentage: positiveNumberValidation,
  quantity: positiveNumberValidation,
  // images: z.array(z.string()),
  category: z.object({
    name: z.string(),
    id: z.number(),
    parentId: z.number().nullable(),
    createdDate: z.date(),
    updatedDate: z.date(),
    parentPath: z.string(),
  }).optional().refine(v => v !== undefined, 'Category is required.'),

  variants: z.object({
    generated_variants_hash: z.string().optional(),
    variants_hash: z.string().optional(),
    primary_variant_index: z.number().min(0),
    options: z.array(
      z.object({
        name: z.string(),
        values: z.array(
          z.object({
            name: z.string()
          })
        )
      })
    ),
    combinations: z.record(
      z.string(),
      z.object({
        price: numberValidation,
        discount_percentage: positiveNumberValidation,
        images: z.array(z.string()),
        quantity: positiveNumberValidation,
        defaultSku: z.string(),
        enabled: z.boolean(),
        customSku: z.string().optional(),
      })
    )
  })
}).superRefine((data, ctx) => {
  const { generated_variants_hash, variants_hash, options } = data.variants
  if (generated_variants_hash !== variants_hash)
    ctx.addIssue({
      path: ['variants'],
      message: "Generated Variants isn't Matching the Variants Options.",
      code: ZodIssueCode.custom
    })
})


export type AddProductFormFields = z.infer<typeof addProductFormSchema>
