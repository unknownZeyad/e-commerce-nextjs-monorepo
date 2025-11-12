'use client'

import Form from '@packages/client/src/components/form/form'

import { useForm } from 'react-hook-form'
import AddProductGeneralInfos from '../components/general-infos'
import AddProductPricing from '../components/pricing'
import { AddProductFormFields, addProductFormSchema } from "../schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@packages/client/src/components/ui/button'
import { Steps } from '@packages/client/src/components/ui/steps'
import { useCreateProduct } from './hooks/use-create-product'
import AddProductHeader from './components/header'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddProductVariants from '../components/variants'
import GenerateVariants from '../components/generate-variants'


const StepsContent = [
  <>
    <AddProductGeneralInfos/>
    <AddProductPricing/>
  </>,
  <>
    <AddProductVariants/>
    <GenerateVariants/>
  </>
]

const steps = [
  {
    label: "Basic Information",
    description: 'Add All Product Basic Infos'
  },
  {
    label: "Variants",
    description: "Add All Product Variants"
  },
]

const validationSteps: (keyof AddProductFormFields)[][] = [
  ['name', 'description', 'category', 'price', 'quantity', 'discount_percentage'],
  []
]


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
  const router = useRouter()
  const [step, setStep] = useState<number>(1)
  const { create, isPending } = useCreateProduct()

  const methods = useForm<AddProductFormFields>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      variants: {
        primary_variant_index: 0
      }
    }
  })
  function handleSubmit (data: AddProductFormFields) {
    if (!isPending) {
      create({
        brand: data.brand,
        description: data.description,
        name: data.name,
        category_full_path: (data.category!).parentPath+(data.category!).id,
        variants: {
          combinations: data.variants.combinations,
          options: data.variants.options,
          primary_variant_index: data.variants.primary_variant_index
        },
      },{
        onSuccess: () => router.push('/dashboard/products')
      })
    }
  }

  const next = async () => {
    const success = await methods.trigger(validationSteps[step-1])
    if (success) setStep(s => s+1)
  }

  return (
    <>
      <div className='w-3/4 mb-6'>
        <Steps steps={steps} currentStep={step}/>
      </div>
      <Form   
        handleSubmit={handleSubmit}
        form={methods}
        key={step}
        className="flex gap-5 flex-col"
      >
        {StepsContent[step-1]}
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
          {steps.length === step ? (
            <Button             
              variant='primary'
              type='submit'
              disabled={isPending}
            >
              Create
            </Button>
          ): (
            <Button 
              type='button'
              variant='primary'
              onClick={next}
            >
              Next
            </Button>
          )}
        </div>
      </Form>
    </>
  )
}