'use client'

import Form from '@packages/client/src/components/form/form'

import { useForm } from 'react-hook-form'
import AddProductGeneralInfos from './components/general-infos'
import AddProductPricing from './components/pricing'
import { AddProductFormFields, addProductFormSchema } from "./schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@packages/client/src/components/ui/button'
import { useCreateProduct } from './hooks/use-create-product'
import ImageUpload from './components/image-upload'
import AddProductVariants from './components/variants'
import AddProductHeader from './components/header'

function AddProduct() {
  return (
    <>
      <AddProductHeader/>
      <ProductForm/>
    </>
  )
}

export default AddProduct


function ProductForm () {
  const { create, isPending } = useCreateProduct()
  const methods = useForm<AddProductFormFields>({
    resolver: zodResolver(addProductFormSchema)
  })

  function handleSubmit (data: AddProductFormFields) {
    if (!isPending)
    create({
      ...data,
      variants: data.variants.map(({ linked_products, name }) => ({
        name,
        linked_products: linked_products.map(({ variant, variant_name }) => ({
          value: variant_name,
          id: variant.value
        }))
      }))
    })
  }

  return (
    <Form   
      handleSubmit={handleSubmit}
      form={methods}
    >
      <div className="lg:grid-cols-[1fr_0.6fr] grid grid-cols-1 gap-5">
        <div className='space-y-5'>
          <AddProductGeneralInfos/>
          <AddProductPricing/>
          <AddProductVariants/>
        </div>

        <ImageUpload/>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <Button 
          variant='destructive'
          type='button'
        >
          Reset
        </Button>
        <Button
          variant='secondary'
          type='button'
        >
          Cancel
        </Button>
        <Button disabled={isPending}>
          Create
        </Button>
      </div>
    </Form>
  )
}