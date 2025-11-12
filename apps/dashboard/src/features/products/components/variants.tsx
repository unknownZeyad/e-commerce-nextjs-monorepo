import { IoMdAdd } from "react-icons/io";
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@packages/client/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@packages/client/src/components/ui/card'
import { FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useRef } from "react";
import { Input } from "@packages/client/src/components/ui/input";
import { BsTrashFill } from "react-icons/bs";
import { AddProductFormFields } from "../schema";


export default function AddProductVariants () {
  const inputRef = useRef<HTMLInputElement>(null)
  const { control, setValue, getValues } = useFormContext<AddProductFormFields>()
  const { fields, append, remove, } = useFieldArray<AddProductFormFields>({
    control,
    name: 'variants.options'
  })

  function addVariant () {
    const value = inputRef.current?.value
    if (value) {
      if (fields.find(curr => curr.name === value)) return
      if (inputRef.current) inputRef.current.value = ''
      append({ name: value, values: [] } as any)
    }
  }

  return (
    <Card>
      <CardHeader className='flex justify-between flex-row items-center'>
        <CardTitle>Add Product Variants</CardTitle>
        <div className="flex gap-4 w-2/3">
          <Input
            ref={inputRef}
            placeholder="Enter Variant Name"
          />
          <Button 
            type="button"
            className='space-x-2 cursor-pointer'
            onClick={addVariant}
          >
            <IoMdAdd/>
            Add Variant
          </Button>
        </div>
      </CardHeader>
      {fields.length ? (
        <CardContent className='space-y-4'>
          {fields.map((curr, index) => (
            <VariantField 
              index={index}
              key={curr.id}
              removeVariant={() => {
                remove(index)
                setValue(
                  'variants.variants_hash', 
                  JSON.stringify(getValues('variants.options')),
                )
              }}
            />
          ))}
        </CardContent>
      ):''}
    </Card>
  )
}

const VariantField = function ({ removeVariant, index }: {
  removeVariant: () => void,
  index: number
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { control, setValue, getValues } = useFormContext<AddProductFormFields>()

  const { append, remove, fields } = useFieldArray<AddProductFormFields>({
    control,
    name: `variants.options.${index}.values`,
  })

  const addValue = () => {
    const value = inputRef.current?.value
    if (value) {
      if (fields.find(curr => curr.name === value)) return
      if (inputRef.current) inputRef.current.value = ''
      append({ name: value })
      setValue(
        'variants.variants_hash', 
        JSON.stringify(getValues('variants.options')),
      )
    }
  }

  return (
    <div className='bg-background border space-y-4 border-white/10 rounded-xl p-5'>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xl font-semibold break-all w-1/3">
          {getValues(`variants.options.${index}.name`)}
        </p>
        <div className="flex gap-2 w-2/3">
          <Input
            ref={inputRef}
            placeholder="Enter Variant Name"
          />
          <Button 
            type="button"
            onClick={addValue}
          >
            <IoMdAdd/>
            Add Value 
          </Button>
          <Button
            type="button"
            onClick={removeVariant}
            variant='destructive'
          >
            <FaRegTrashAlt/>
          </Button>
        </div>
      </div>
      {fields.length ? (
        <div className="flex gap-2 flex-wrap">
          {fields.map(({ name, id }, idx) => (
            <div 
              key={id} 
              className="gap-2 flex items-center p-2 pl-4 bg-light-black border border-white/10 rounded-lg text-black"
            >
              <p className="text-white">{name}</p>
              <BsTrashFill 
                className="text-red-500 text-2xl rounded p-1 cursor-pointer hover:bg-red-500/20"
                onClick={() => {
                  remove(idx)
                  setValue(
                    'variants.variants_hash', 
                    JSON.stringify(getValues('variants.options')),
                  )
                }} 
              />
            </div>
          ))}
        </div>
      ) : ''}
    </div>
  )
}

