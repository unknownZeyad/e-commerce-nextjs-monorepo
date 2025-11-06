'use client'

import React, { useState } from 'react'
import { useGetProduct } from '../hooks/use-get-product'
import { Card, CardContent, CardHeader, CardTitle } from '@packages/client/src/components/ui/card'
import { formatDate } from '@/core/lib/utils'
import Link from 'next/link'
import { Button } from '@packages/client/src/components/ui/button'
import { useGetCategoryFullPath } from '@/features/categories/hooks/use-get-category-full-path'
import { ChevronRightIcon } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@packages/client/src/components/ui/carousel'
import { RiArrowRightWideLine, RiArrowLeftWideLine } from "react-icons/ri";
import { cn } from '@packages/client/src/lib/utils'
import { FaImage } from 'react-icons/fa6'


function ProductDetails() {
  const { data, isLoading } = useGetProduct()

  if (isLoading) return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex gap-7'>
          <div className="skeleton h-auto w-1/3 aspect-square"/>
          <div className='w-2/3'>
            <div className='h-[40px] mb-3 skeleton'/>
            <div className='h-[30px] mb-12 rounded-full skeleton'/>
            <div className='space-y-3'>
              <div className='h-[30px] skeleton'/>
              <div className='h-[20px] skeleton'/>
              <div className='h-[20px] skeleton'/>
              <div className='h-[20px] skeleton'/>
              <div className='h-[20px] skeleton'/>
              <div className='space-y-1 mt-6'>
                <div className='h-[15px] skeleton'/>
                <div className='h-[15px] skeleton'/>
                <div className='h-[15px] skeleton'/>
                <div className='h-[15px] skeleton'/>
                <div className='h-[15px] skeleton'/>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (!data) return <div>No Data To Show</div>

  return (
    <div>
      <Card>
        <CardContent className='pt-6 flex gap-7'>
          <ProductImageViewer/>
          <div className='w-2/3 space-y-6'>
            <BaseDetails/>
           
            
            <Variants/>
            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductDetails


function BaseDetails () {
  const { data, isLoading: isLoading1 } = useGetProduct()
  const { data: categoryPath, isLoading: isLoading2 } = useGetCategoryFullPath((data!).categoryFullPath, !isLoading1)
  

  return (
    <div>
      <h3 className='text-3xl font-semibold ml-1'>{data!.currentVariant.name}</h3>
      <div className={cn(
        "flex-wrap flex gap-2 mt-2 bg-black !rounded-full px-4 py-0.5 border border-white/15 w-fit",
        isLoading2 && 'skeleton h-[30px] w-[300px]'
      )}>
        {
          categoryPath?.map((curr, index) => (
            <div key={curr.id} className="flex gap-2 items-center">
              <p>{curr.name}</p>
              {index < categoryPath.length - 1 && (
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              )}
            </div>
          ))
        }
      </div>
    </div>
  )
}

function Variants () {
  const { data } = useGetProduct()
  const sku = data!.currentVariant.defaultSku

  const getVariantSku = (value: string, index: number) => {
    const id = sku.split('_')[0]
    const realSku = sku.split('_')[1]

    const toSku = realSku.split('-')
    toSku[index] = value
    return `${id}_${toSku.join('-')}`
  }

  return (
    <div className='w-full gap-3 flex flex-col'>
      {(data!).variants.map(({ name, values }, index) => (
        <div key={index}>
          <p className='text-lg mb-2 font-medium capitalize'>{name}</p>
          <div className='flex gap-2 w-fit'>
            {values.map((value,idx) => (
              <Button 
                key={idx} 
                variant={sku.includes(value) ? 'primary' : 'secondary'}
                className='capitalize'
              >
                <Link href={`?sku=${getVariantSku(value, index)}`}>
                  {value}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}



export function ProductImageViewer () {
  const { data } = useGetProduct()

  return (
    <div className='w-1/3 h-fit'>
      {
        data?.length ? (
          <Carousel className="w-full aspect-square">
            <CarouselContent className="flex">
              {data.images.map((curr) => (
                <CarouselItem
                  key={curr}
                  className='w-full aspect-square'
                >
                  <img
                    src={curr}
                    className="object-cover w-full h-full rounded-2xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="!p-0 !w-auto !h-auto bg-transparent">
              <RiArrowRightWideLine className="h-[100px] w-[100px] text-8xl" />
            </CarouselNext>

            <CarouselPrevious className="!p-0 !w-auto !h-auto bg-transparent">
              <RiArrowLeftWideLine className="h-[100px] w-[100px] text-8xl" />
            </CarouselPrevious>

          </Carousel>
        ) : (
          <div className="w-full border border-white/15 aspect-square bg-black flex items-center justify-center rounded-2xl">
            <FaImage className='text-8xl text-white/20'/>
          </div>
        )
      }
    </div>
  )
}