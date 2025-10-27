import { IoMdAdd } from "react-icons/io";
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@packages/client/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@packages/client/src/components/ui/card'
import { FaRegTrashAlt } from "react-icons/fa";
import { AddProductFormFields } from "../schema";
import { useRef } from "react";
import { Input } from "@packages/client/src/components/ui/input";
import { BsTrashFill } from "react-icons/bs";

export default function AddProductVariants () {
  const inputRef = useRef<HTMLInputElement>(null)
  const { control } = useFormContext<AddProductFormFields>()
  const { fields, append, remove } = useFieldArray<AddProductFormFields>({
    control,
    name: 'variants'
  })

  function addVariant () {
    const value = inputRef.current?.value
    if (value) {
      if (fields.find(curr => curr.name === value)) return
      if (inputRef.current) inputRef.current.value = ''
      append({
        name: value, 
        values: []
      })
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
              key={curr.id}
              removeVariant={() => remove(index)}
              index={index}
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
  const { control, setValue } = useFormContext<AddProductFormFields>()
  const { name, values } = useWatch({
    control,
    name: `variants.${index}`
  })

  function append () {
    const value = inputRef.current?.value
    if (value) {
      if (values.includes(value)) return
      if (inputRef.current) inputRef.current.value = ''
      setValue(
        `variants.${index}.values`, 
        [...values, value]
      )
    }
  }

  function remove (vIndex: number) {
    const filtered = values.filter((_,idx)=> idx !== vIndex)
    setValue(`variants.${index}.values`, filtered)
  }

  return (
    <div className='bg-background border space-y-4 border-white/10 rounded-xl p-5'>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xl font-semibold break-all w-1/3">{name}</p>
        <div className="flex gap-2 w-2/3">
          <Input
            ref={inputRef}
            placeholder="Enter Variant Name"
          />
          <Button 
            type="button"
            onClick={append}
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
      {values.length ? (
        <div className="flex gap-2 flex-wrap">
          {values.map((curr, idx) => (
            <div 
              key={idx} 
              className="gap-2 flex items-center p-2 pl-4 bg-light-black border border-white/10 rounded-lg text-black"
            >
              <p className="text-white">{curr}</p>
              <BsTrashFill 
                onClick={() => remove(idx)} 
                className="text-red-500 text-2xl rounded p-1 cursor-pointer hover:bg-red-500/20"
              />
            </div>
          ))}
        </div>
      ) : ''}
    </div>
  )
}

