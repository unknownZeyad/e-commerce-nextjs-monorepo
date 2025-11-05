'use client'

import Form from '@packages/client/src/components/form/form'

import { useForm } from 'react-hook-form'
import AddProductGeneralInfos from './components/general-infos'
import AddProductPricing from './components/pricing'
import { AddProductFormFields, addProductFormSchema } from "./schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@packages/client/src/components/ui/button'
import { useCreateProduct } from './hooks/use-create-product'
import AddProductVariants from './components/variants'
import AddProductHeader from './components/header'
import { useState } from 'react'
import GenerateVariants from './components/generate-variants'

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
  const [step, setStep] = useState<number>(1)
  const { create, isPending } = useCreateProduct()
  const methods = useForm<AddProductFormFields>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      variants: {
        primary_variant_index: 0,
        combinations: {},
        options: [],
      }
    }
  })

  function handleSubmit (data: AddProductFormFields) {
    if (!isPending) {
      create({
        ...data,
        category_full_path: (data.category!).parentPath+(data.category!).id,
      })
    }
  }

  return (
    <>
      <Form   
        handleSubmit={handleSubmit}
        form={methods}
        className="flex gap-5 flex-col"
      >
        <AddProductGeneralInfos/>
        <AddProductPricing/>
        <AddProductVariants/>
        <GenerateVariants/>
        <div className="flex gap-2 justify-end">
          <Button
            variant='outline'
            type='button'
          >
            Cancel
          </Button>
          {step > 1 && (
            <Button 
              type='button'
              variant='secondary'
              onClick={() => setStep((s => s-1))}
            >
              Back
            </Button>
          )}
          <Button             
            variant='primary'
            type='submit'
            disabled={isPending}
          >
            Create
          </Button>
        </div>
      </Form>
    </>
  )
}