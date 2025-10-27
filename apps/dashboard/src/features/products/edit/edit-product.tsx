'use client'
import React, { useMemo } from 'react'
import EditProductHeader from './components/header'
import { useGetProduct } from '../product/hooks/use-get-product'
import { useForm } from 'react-hook-form'
import { AddProductFormFields, addProductFormSchema } from '../add/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Form from '@packages/client/src/components/form/form'
import { useIsMounted } from '@packages/client/src/hooks/use-is-mounted'
import AddProductGeneralInfos from '../add/components/general-infos'
import AddProductPricing from '../add/components/pricing'
import AddProductVariants, { ProductSearchBoxOption } from '../add/components/variants'
import { Button } from '@packages/client/src/components/ui/button'
import { useGetProductWithVariants } from './hooks/use-get-product-with-variants'


function EditProduct() {
  return (
    <>
      <EditProductHeader/>
      <ProductForm/>
    </>
  )
}

export default EditProduct


function ProductForm () {
  const { data, isLoading, error } = useGetProductWithVariants()

  const variants = useMemo(() => {
    if (data)
    return data?.variants.map(({ linked_products, name }) => ({
        name,
        linked_products: linked_products.map(({ product, value }) => ({
          variant_name: value,
          variant: {
            value: product.id,
            label: <ProductSearchBoxOption {...product}/>
          }
        }))
      }))
    else return []
  },[data])

  const methods = useForm<AddProductFormFields>({
    resolver: zodResolver(addProductFormSchema),
    values: {
      category_full_path: data?.categoryFullPath!,
      description: data?.description!,
      images: data?.images || [],
      discount_percentage: data?.discountPercentage?.toString() || '',
      name: data?.name!,
      price: data?.price.toString()!,
      quantity: data?.quantity.toString()!,
      variants: variants
    }
  })

  if (isLoading) return <div>Loading Mother Fucker</div>

  function handleSubmit (data: AddProductFormFields) {
    
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

        {/* <ImageUpload/> */}
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
        <Button disabled={false}>
          Create
        </Button>
      </div>
    </Form>
  )
}