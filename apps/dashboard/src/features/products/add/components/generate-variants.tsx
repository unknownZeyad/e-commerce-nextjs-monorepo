'use client'

import { Button, ButtonProps } from '@packages/client/src/components/ui/button'
import React, { memo, ReactNode, useEffect, useRef, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { AddProductFormFields } from '../schema'
import Table from '@packages/client/src/components/ui/table'
import { Checkbox } from '@packages/client/src/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@packages/client/src/components/ui/card'
import FormInput from '@packages/client/src/components/form/form-input'
import { cn } from '@packages/client/src/lib/utils'
import { BsFillPinAngleFill, BsStars } from "react-icons/bs";
import { Popover, PopoverContent, PopoverTrigger } from '@packages/client/src/components/ui/popover'
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useSmartUpload } from '../../../../core/hooks/use-smart-upload'
import FileUploadButton from '@/core/components/ui/file-upload-button'
import { ImSpinner8 } from "react-icons/im";
import { IoMdClose } from 'react-icons/io'
import { config } from '@/core/config'
import { v4 as uuid } from 'uuid';
import { strict } from 'assert'

function GenerateVariants() {
  const [combinations, setCombinations] = useState<string[]>([])
  const workerRef = useRef<Worker>(null)
  const { getValues, setValue } = useFormContext<AddProductFormFields>()

  const generateVariants = (variants: AddProductFormFields['variants']) => {
    if (variants.length) {
      workerRef.current?.postMessage(variants) 
    }else {
      setCombinations([])
      setValue('variant_combinations', {})
    }
  }

  useEffect(() => {
    const worker = new Worker('/workers/variant-generator.js');
    workerRef.current = worker
    workerRef.current.addEventListener("message", e => setCombinations(e.data)) 

    return () => worker.terminate()
  },[])

  return (
    <>
      <Button 
        onClick={() => generateVariants(getValues('variants'))}
        variant='primary'
        type='button'
      >
        <BsStars className='text-2xl'/>
        Generate Variants
      </Button>
      {
        combinations.length ? (
          <Card>
            <CardHeader>
              <CardTitle>Generated Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <Table horizontalAlignment='center' columns='grid-cols-[60px_60px_1fr_0.9fr_0.65fr_0.65fr_0.65fr_60px]'>
                <Table.Header className='text-center !bg-black'>
                  <Table.Cell>Primary</Table.Cell>
                  <Table.Cell>Enabled</Table.Cell>
                  <Table.Cell>Variant</Table.Cell>
                  <Table.Cell>Custom SKU</Table.Cell>
                  <Table.Cell>Price</Table.Cell>
                  <Table.Cell>Quantity</Table.Cell>
                  <Table.Cell>Discount Percentage</Table.Cell>
                  <Table.Cell>Images</Table.Cell>
                </Table.Header>
                <Table.VirtualizedBody
                  overscan={20}
                  data={combinations}
                  render={(sku, idx) => <VariantRow index={idx} sku={sku} key={idx}/>}
                />
              </Table>
            </CardContent>
          </Card>
        ) : null
      }
    </>
  )
}

export default GenerateVariants


const VariantRow = memo(function ({ sku, index }: { 
  sku: string,
  index: number
}) {
  
  const { getValues, control, setValue } = useFormContext<AddProductFormFields>()
  const enabled = useWatch({
    control,
    name: `variant_combinations.${sku}.enabled`,
    defaultValue: true
  })

  const primaryIdx = useWatch({
    control,
    name: `primary_variant_index`,
  })

  useEffect(() => {
    setValue(`variant_combinations.${sku}.defaultSku`, sku)
    setValue(`variant_combinations.${sku}.images`, [])
  },[])

  const isPrimary = primaryIdx === index

  return (
    <Table.Row className={cn(
      !enabled && 'opacity-50',
      isPrimary && 'bg-rose-600/40'
    )}>
      <Table.Cell>
        <Checkbox
          checked={isPrimary}
          onCheckedChange={() => setValue('primary_variant_index', index)}
        />
      </Table.Cell>
      <Table.Cell>
        <Controller
          name={`variant_combinations.${sku}.enabled`}
          control={control}
          defaultValue={true}
          render={({ field }) => {
            const onChange = isPrimary ? () => field.onChange(true) : field.onChange
            return (
              <Checkbox
                checked={field.value}
                onCheckedChange={onChange}
              />
            )
          }}  
        />
      </Table.Cell>
      <Table.Cell>{sku}</Table.Cell>
      <Table.Cell>
        <FormInput
          name={`variant_combinations.${sku}.customSku`} 
          placeholder='Enter SKU' 
          type='text'
          disabled={!enabled}
          showValidationMessage={false}
        />
      </Table.Cell>
      <Table.Cell>
        <FormInput
          name={`variant_combinations.${sku}.price`} 
          placeholder='Price' 
          defaultValue={getValues('price')}
          type='number'
          disabled={!enabled}
          showValidationMessage={false}
        />
      </Table.Cell>
      <Table.Cell>
        <FormInput
          name={`variant_combinations.${sku}.quantity`} 
          placeholder='Quantity' 
          defaultValue={getValues('quantity')}
          type='number'
          disabled={!enabled}
          showValidationMessage={false}
        />
      </Table.Cell>
      <Table.Cell>
        <FormInput
          disabled={!enabled}
          name={`variant_combinations.${sku}.discount_percentage`} 
          placeholder='Disount' 
          defaultValue={getValues('discount_percentage')}
          type='number'
          showValidationMessage={false}
        />
      </Table.Cell>
      <Table.Cell>
        <ImageUpload 
          sku={sku}
          trigger={(
            <Button disabled={!enabled} variant='outline'>
              <AiOutlineCloudUpload className='text-2xl'/>
            </Button>
          )}
        />
      </Table.Cell>
    </Table.Row>
  )
})

function ImageUpload({ sku, trigger }: { 
  sku: string,
  trigger: ReactNode
}) {
  const { setValue, getValues } = useFormContext<AddProductFormFields>()
  const [pinnedIdx,setPinnedIdx] = useState<number>(0)
  const { images, deleteImage, uploadImage, isUploading } = useSmartUpload({
    uploadKey: sku
  })

  useEffect(() => {
    !pinnedIdx && setPinnedIdx(0)
    setValue(
      `variant_combinations.${sku}.images`, 
      images.map((c) => `${config.imageBaseUrl}/${c}`)
    )
  },[images])

  useEffect(() => {
    const images = getValues(`variant_combinations.${sku}.images`)
    const pinned = images[pinnedIdx]
    const first = images[0]
    setValue(`variant_combinations.${sku}.images.0`, pinned)
    setValue(`variant_combinations.${sku}.images.${pinnedIdx}`, first)
  },[pinnedIdx])

  return (
    <Popover open={isUploading ? true : undefined}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className='w-[30vw] max-w-[400px]'>
        <FileUploadButton uploadImage={uploadImage}>
          <Button 
            disabled={isUploading}
            className='w-full' 
            variant='outline' 
            size='sm'
          >
            {!isUploading ? <AiOutlineCloudUpload/> : <ImSpinner8 className='animate-spin'/>}
            Upload Image
          </Button>
        </FileUploadButton>
        <div className={cn("grid grid-cols-4 gap-2 overflow-auto mt-2 pb-2", !images.length && 'hidden')}>
          {images.map((curr, idx) => (
            <div
              key={curr}
              className='aspect-square w-full transition-all duration-200 relative'
            >
              <img
                src={`${config.imageBaseUrl}/${curr}`}
                className="object-cover border border-white/10 w-full h-full rounded-lg overflow-hidden"
                alt={curr}
              />
              {pinnedIdx === idx ? (
                <div className="absolute left-2 bottom-2 px-2 py-0.5 font-medium text-[8px] rounded-full bg-rose-500 text-white">
                  Primary
                </div>
              ): ''}
              <div className="flex gap-1 absolute top-2 right-2">
                {pinnedIdx !== idx ? (
                  <BsFillPinAngleFill
                    onClick={() => setPinnedIdx(idx)} 
                    className="text-white cursor-pointer bg-orange-400 hover:bg-orange-500
                    duration-150 text-lg p-1 rounded"
                  />
                ):''}
                <IoMdClose
                  onClick={() => deleteImage(curr)} 
                  className="text-white cursor-pointer bg-red-600 hover:bg-red-700
                  duration-150 text-lg p-1 rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

