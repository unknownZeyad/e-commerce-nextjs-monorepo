
import z from "zod";
const onlyNumbersRegex = /^(?:\d+(?:\.\d+)?|\.\d+)$/
const positiveNumberRegex = /^(?:\d+(?:\.\d+)?|\.\d+)$/;

export const addProductFormSchema = z.object({
  name: z.string().refine(v => v.length > 3, 'Product Name Must Be More than 3 Characters.'),
  description: z.string().refine(v => v.length > 3, 'Product Description Must Be More than 3 Characters.'),
  price: z.string().regex(onlyNumbersRegex, 'Price Must Be A Valid Number.'),
  discount_percentage: z.string().regex(onlyNumbersRegex, 'Discount Percentage Must Be a Number From 0 to 100.'),
  quantity: z.string().regex(positiveNumberRegex, 'Quantity Must Be A Positive Number.'),
  category_full_path: z.string(),
  images: z.array(z.string()),
  variants: z.array(
    z.object({
      name: z.string(),
      linked_products: z.array(
        z.object({
          variant_name: z.string(),
          variant: z.object({
            label: z.any(),
            value: z.int()
          })
        })
      )
    })
  )
})

export type AddProductFormFields = z.infer<typeof addProductFormSchema>
