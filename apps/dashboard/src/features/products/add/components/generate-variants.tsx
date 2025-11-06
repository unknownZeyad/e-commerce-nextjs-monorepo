'use client'

import { Button } from '@packages/client/src/components/ui/button'
import React, { memo, ReactNode, useEffect, useId, useRef, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { AddProductFormFields } from '../schema'
import Table from '@packages/client/src/components/ui/table'
import { Checkbox } from '@packages/client/src/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@packages/client/src/components/ui/card'
import FormInput from '@packages/client/src/components/form/form-input'
import { cn } from '@packages/client/src/lib/utils'
import { BsStars } from "react-icons/bs";
import { Popover, PopoverContent, PopoverTrigger } from '@packages/client/src/components/ui/popover'
import { AiOutlineCloudUpload } from "react-icons/ai";
import { configs } from '@/core/lib/configs'
import { useUploadMediaFiles } from '@/features/media-manager/hooks/use-upload-files'
import { PiSpinnerBold } from "react-icons/pi";
import { IoMdCloudUpload } from 'react-icons/io'
import { useDeleteMediaFile } from '@/features/media-manager/hooks/use-delete-media-file'

function GenerateVariants() {
  const { getValues, setValue, unregister, formState } = useFormContext<AddProductFormFields>()
  const [combinations, setCombinations] = useState<string[]>(
    Object.keys(getValues('variants.combinations') || {}) 
  )
  const workerRef = useRef<Worker>(null)
  const generatedHash = getValues('variants.generated_variants_hash')

  const generateVariants = (vOptions: AddProductFormFields['variants']['options']) => {
    setCombinations([])
    unregister('variants.combinations')
    if (vOptions.length) { 
      workerRef.current?.postMessage(vOptions) 
      setValue('variants.generated_variants_hash', JSON.stringify(vOptions))
    }
  }

  useEffect(() => {
    const worker = new Worker('/workers/variant-generator.js');
    workerRef.current = worker
    workerRef.current.addEventListener("message", 
      ({ data }) => setCombinations(data)
    ) 

    return () => worker.terminate()
  },[])
  
  return (
    <>
      <Button 
        onClick={() => generateVariants(getValues('variants').options)}
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
                  key={generatedHash}
                  data={combinations}
                  render={(sku, idx) => <VariantRow index={idx} sku={sku} key={sku}/>}
                />
              </Table>
            </CardContent>
          </Card>
        ) : null
      }
      {formState.errors?.variants ? (
        <p className='text-sm text-red-600 mt-1'>
          {formState.errors.variants.message as string}
        </p>
      ) : null}
    </>
  )
}

export default GenerateVariants


const VariantRow = memo(function ({ sku, index }: { 
  sku: string,
  index: number
}) {
  const { control, setValue, getValues } = useFormContext<AddProductFormFields>()

  const enabled = useWatch({
    control,
    name: `variants.combinations.${sku}.enabled`,
    defaultValue: true
  })

  const primaryIdx = useWatch({
    control,
    name: `variants.primary_variant_index`,
  })

  useEffect(() => {
    const defaultImgs = getValues(`variants.combinations.${sku}.images`) || []
    setValue(`variants.combinations.${sku}.defaultSku`, sku)
    setValue(`variants.combinations.${sku}.images`, defaultImgs)
  },[])

  const isPrimary = primaryIdx === index

  return (
    <Table.Row className={cn(
      !enabled && 'opacity-50',
      isPrimary && 'bg-rose-600/40'
    )}>
      <Table.Cell>
        <Checkbox
          disabled={!enabled}
          checked={isPrimary}
          onCheckedChange={() => setValue('variants.primary_variant_index', index)}
        />
      </Table.Cell>
      <Table.Cell>
        <Controller
          name={`variants.combinations.${sku}.enabled`}
          control={control}
          defaultValue={true}
          render={({ field }) => {            
            return (
              <Checkbox
                disabled={isPrimary}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )
          }}  
        />
      </Table.Cell>
      <Table.Cell>{sku}</Table.Cell>
      <Table.Cell>
        <FormInput
          name={`variants.combinations.${sku}.customSku`} 
          placeholder='Enter SKU' 
          type='text'
          disabled={!enabled}
          showValidationMessage={false}
        />
      </Table.Cell>
      <Table.Cell>
        <FormInput
          name={`variants.combinations.${sku}.price`} 
          placeholder='Price' 
          type='number'
          defaultValue={getValues('price')}
          disabled={!enabled}
          showValidationMessage={false}
        />
      </Table.Cell>
      <Table.Cell>
        <FormInput
          name={`variants.combinations.${sku}.quantity`} 
          placeholder='Quantity' 
          type='number'
          disabled={!enabled}
          defaultValue={getValues('quantity')}
          showValidationMessage={false}
        />
      </Table.Cell>
      <Table.Cell>
        <FormInput
          disabled={!enabled}
          name={`variants.combinations.${sku}.discount_percentage`} 
          placeholder='Disount' 
          type='number'
          defaultValue={getValues('discount_percentage')}
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
  const id = useId()
  const { setValue, watch, getValues } = useFormContext<AddProductFormFields>()
  const images = watch(`variants.combinations.${sku}.images`) || []

  const { upload, isUploading } = useUploadMediaFiles({
    onUpload: (uploaded) => {
      const oldImages = getValues(`variants.combinations.${sku}.images`) || []
      setValue(`variants.combinations.${sku}.images`, [...oldImages, uploaded.url])
    }
  })   

  function handleUpload (e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files!)
    .filter((currFile) => {
      const isValidSize = currFile.size <= configs.MAX_FILE_SIZE
      const isNotDuplicated = !images.find((url) =>
        url.endsWith(encodeURIComponent(currFile.name))
      )
      return isValidSize && isNotDuplicated
    })
    upload(newFiles)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className='w-[30vw] max-w-[400px]'>
        <p className='text-lg font-medium'>Upload Images</p>
        <label 
          htmlFor={id} 
          className={cn(
            'w-full mt-4 px-3 pt-3 pb-6 rounded-xl flex-col gap-1 !flex items-center justify-center bg-rose-500/10 cursor-pointer border-2 border-rose-700 border-dashed',
            isUploading && 'cursor-not-allowed opacity-70'
          )}
        >
          {isUploading? <PiSpinnerBold className='text-4xl text-rose-700 animate-spin'/> : <IoMdCloudUpload className='text-6xl text-rose-700'/>}
          <p className="text-rose-700 text-xs font-medium text-center">Max Image Size Should be 1 MB</p>
        </label>
        <input
          id={id}
          className='hidden'
          type='file'
          accept="image/*"
          disabled={isUploading}
          onChange={handleUpload}
          multiple
        />
        <div className='w-full grid grid-cols-4 mt-4 gap-2 max-h-[200px] overflow-auto pr-1'>
          {images.map((curr) => <Image key={curr} url={curr}/>)}
        </div>
      </PopoverContent>
    </Popover>
  )
}


function Image ({ url }: {
  url: string
}) {
  const { deleteFile } = useDeleteMediaFile()

  return (
    <div className='w-full relative'>
      <img 
        src={url} 
        alt="Uploaded Image"
        className='aspect-square w-full object-cover rounded-lg block' 
      />

    </div>
  )
}