import { IoMdAdd } from "react-icons/io";
import { useFieldArray } from 'react-hook-form'
import { Button } from '@packages/client/src/components/ui/button'
import FormInput from '@packages/client/src/components/form/form-input'
import FormAsyncSearchBox from '@packages/client/src/components/form/form-async-search-box'
import { Card, CardContent, CardHeader, CardTitle } from '@packages/client/src/components/ui/card'
import { FaRegTrashAlt } from "react-icons/fa";
import { AddProductFormFields } from "../schema";
import { ComponentProps } from "react";;
import { useSearchProducts } from "../hooks/use-search-products";
import { FaImage } from "react-icons/fa6";

export default function AddProductVariants () {
  const { fields, remove, append } = useFieldArray<AddProductFormFields>({
    name: 'variants'
  })

  return (
    <Card>
      <CardHeader className='flex justify-between flex-row items-center'>
        <CardTitle>Product Variants</CardTitle>
        <Button 
          type="button"
          className='space-x-2'
          onClick={() => append({
            name: '',
            linked_products: [],
          })}
        >
          <IoMdAdd/>
          Add Variant
        </Button>
      </CardHeader>
      <CardContent className='space-y-4'>
        {fields.length ? fields.map((curr, index) => (
          <VariantField 
            key={curr.id}
            removeVariant={() => remove(index)}
            index={index}
          />
        )) : <p className="text-center text-sm text-zinc-300">No Variants Are Added</p>}
      </CardContent>
    </Card>
  )
}

function VariantField ({ removeVariant, index }: {
  removeVariant: () => void,
  index: number
}) {
  const { append, remove, fields } = useFieldArray<AddProductFormFields>({
    name: `variants.${index}.linked_products`
  })

  return (
    <div className='bg-background border border-white/10 rounded-xl p-5'>
      <div className="flex items-center justify-between mb-4">
        <p className="tex-lg font-semibold">Variant {index+1}</p>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={removeVariant}
            variant='destructive'
          >
            <FaRegTrashAlt/>
          </Button>
          <Button 
            type="button"
            onClick={() => append({ 
              name: '', 
              linked_products: [] 
            })}
          >
            <IoMdAdd/>
          </Button>
        </div>
      </div>
      <div className="flex gap-3">
        <FormInput
          name={`variants.${index}.name`}
          placeholder="Enter Variant Name, Ex: Sizes, Colors"
        />
        
      </div>

      <div className="space-y-3 mt-4">
        {fields.length ? 
          fields.map((curr, idx) => (
              <div key={curr.id} className="grid grid-cols-[minmax(100px,0.35fr)_1fr_48px] gap-2">
                <FormInput
                  name={`variants.${index}.linked_products.${idx}.variant_name`}
                  placeholder="Ex: Blue, XL, 500GB"
                  className="h-full"
                />
                <ProductsSearchBox
                  name={`variants.${index}.linked_products.${idx}.variant`}
                  placeholder="Search For Product"
                />
                <Button
                  type="button"
                  onClick={() => remove(idx)}
                  variant='destructive'
                  className="h-full"
                >
                  <FaRegTrashAlt/>
                </Button>
              </div>
            )
          ) : 
          <p className="text-center text-sm mt-2 text-zinc-300">No Values Are Added</p>
        }
      </div>
    </div>
  )
}

function ProductsSearchBox (props: Omit<ComponentProps<typeof FormAsyncSearchBox>, 'fetchOptions'>) {
  const searchProducts = useSearchProducts()
  
  const loadOptions = async (query: string) => {
    const products = await searchProducts(query)

    return products.map(({ name, id, price, quantity, images }) => ({
      value: id,
      label: (
        <div className="flex gap-2">
          <div className="h-[50px] rounded-lg w-[50px] flex items-center justify-center bg-zinc-800 border border-white/10">
            {
              images?.[0] ? 
              <img src={images[0]}/> : 
              <FaImage className="text-white/40 text-2xl"/>
            }
          </div>
          <div className="space-y-1 text-left">
            <p>{name}</p>
            <p className="text-[12px]">Price: {price}</p>
            <p className="text-[12px]">Quantity: {quantity}</p>
          </div>
        </div>
      ),
    })) 
  }

  return (
    <FormAsyncSearchBox
      fetchOptions={loadOptions}
      {...props}
    />
  )
}