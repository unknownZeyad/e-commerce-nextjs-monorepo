'use server'

import { categoryService } from "@packages/server/features/categories/services"
import { productRepo } from "@packages/server/features/products/repo"
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


export async function createProductAction(payload: z.infer<typeof addProductSchema>) {
  addProductSchema.parse(payload);

  await productRepo.create({
    categoryFullPath: payload.category_full_path,
    description: payload.description,
    name: payload.name,
    price: +payload.price,
    quantity: +payload.quantity,
    discountPercentage: +payload.discount_percentage,
    variants: payload.variants,
    images: payload.images
  })
}


