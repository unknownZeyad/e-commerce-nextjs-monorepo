'use client'

import { useMemo, useState } from "react"
import { AddProductFormFields, addProductFormSchema } from "../schema"
import { useRouter } from "next/navigation"
import AddProductGeneralInfos from "../components/general-infos"
import AddProductPricing from "../components/pricing"
import GenerateVariants from "../components/generate-variants"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Steps } from "@packages/client/src/components/ui/steps"
import Form from "@packages/client/src/components/form/form"
import { Button } from "@packages/client/src/components/ui/button"
import AddProductVariants from "../components/variants"
import { useGetProductWithVariants } from "./hooks/use-get-product-with-variants"
import EditProductHeader from "./components/header"
import { useEditProduct } from "./hooks/use-edit-product"

const steps = [
  {
    label: "Edit Basic Information",
    description: 'Edit Product Basic Infos'
  },
  {
    label: "Edit Variants",
    description: "Edit Product Variants"
  },
]

const validationSteps: (keyof AddProductFormFields)[][] = [
  ['name', 'description', 'category', 'price', 'quantity', 'discount_percentage'],
  []
]


function EditProduct() {
  return (
    <>
      <EditProductHeader/>
      <EditProductForm/>
    </>
  )
}

export default EditProduct


function EditProductForm () {
  const router = useRouter()
  const [step, setStep] = useState<number>(1)
  const { data, isLoading, error } = useGetProductWithVariants()
  const { isPending, edit } = useEditProduct()
  const values: AddProductFormFields = useMemo(() => {
    let primaryVariantIdx: number = 0
    const combinations: AddProductFormFields['variants']['combinations'] = {}
    data?.variants.combinations.forEach((curr, idx) => {
      const sku = curr.defaultSku.split('_')[1] 

      if (data.mainVariantId === curr.id) {
        primaryVariantIdx = idx
      }
         
      combinations[sku] = {
        defaultSku: sku,
        enabled: !curr.disabled,
        images: curr.images,
        discount_percentage: `${curr.discountPercentage}`,
        price: `${curr.price}`,
        quantity: `${curr.quantity}`,
        customSku: curr.customSku ?? undefined
      }
    })
    return {
      discount_percentage: '',
      price: '',
      quantity: '',
      brand: data?.brand || '',
      description: data?.description || '',
      name: data?.name || '',
      category: data?.category,
      variants: {
        combinations,
        primary_variant_index: primaryVariantIdx,
        generated_variants_hash: '',
        variants_hash: '',
        options: data?.variants.options.map(({ name, values }) => ({
          name,
          values: values.map((name) => ({ name }))
        })) || [],
      }
    }
  },[data])

  const methods = useForm<AddProductFormFields>({
    resolver: zodResolver(addProductFormSchema),
    values
  })
console.log(methods.formState)

  function handleSubmit (data: AddProductFormFields) {
    console.log(data)
    if (!isPending) {
      edit({
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
        // onSuccess: () => router.push('/dashboard/products')
      })
    }
  }

  const next = async () => {
    const success = await methods.trigger(validationSteps[step-1])
    if (success) setStep(s => s+1)
  }

  if (isLoading) return <div>Loading</div>

  return (
    <>
      <div className='w-3/4 mb-6'>
        <Steps steps={steps} currentStep={step}/>
      </div>
      <Form
        handleSubmit={handleSubmit}
        form={methods}
        className="flex gap-5 flex-col"
      >
        {[
          <>
            <AddProductGeneralInfos/>
            <AddProductPricing/>
          </>,
          <>
            <AddProductVariants/>
            <GenerateVariants existingVariants={values.variants.combinations}/>
          </>
        ][step-1]}
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
              disabled={isLoading}
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