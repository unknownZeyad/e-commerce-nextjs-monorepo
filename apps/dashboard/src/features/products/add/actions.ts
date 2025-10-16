'use server'

import { categoryService } from "@packages/server/features/categories/services"
import { ProductFilterKey, productRepo } from "@packages/server/features/products/repo"
import { addProductFormSchema } from "./schema"
import z from "zod"


const addProductSchema = addProductFormSchema.extend({
  variants: z.array(
    z.object({
      name: z.string(),
      linked_products: z.array(
        z.object({
          value: z.string(),
          id: z.int()
        })
      )
    })
  )
})





export async function createProductAction({ full_category_path, ...rest }: z.infer<typeof addProductSchema>) {
  addProductSchema.parse({
    ...rest,
    full_category_path
  });
  const categoriesPath = await categoryService.getCategoriesFullPath(full_category_path)
  const categories = categoriesPath.map((c) => c.id) 

  await productRepo.create({
    categories,
    description: rest.description,
    name: rest.name,
    price: +rest.price,
    quantity: +rest.quantity,
    discountPercentage: +rest.discount_percentage,
    variants: rest.variants
  })
}


