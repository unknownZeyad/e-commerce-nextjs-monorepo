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


function ProductDetails() {
  const { data, isLoading } = useGetProduct()

  if (isLoading) return (
    <div>
      
    </div>
  )

  if (!data) return <div>No Data To Show</div>

  return (
    <div>
      <Card>
        <CardContent className='pt-6 flex gap-7'>
          <ProductImageViewer/>
          <div className='w-2/3 space-y-6'>
            <BaseDetails/>
            <div className='font-medium text-zinc-300'>
              <p className='mb-2 text-lg font-semibold'>General Information</p>
              <p>
                <span>Price: </span>
                <span className='text-white'>
                  {data.price}
                </span>
              </p>
              {data.discountPercentage ? (
                <p>
                  <span>Discount Percentage: </span>
                  <span className='text-white'>
                    {data.discountPercentage}%
                  </span>
                </p>
              ): ''}
              <p>
                <span>Quantity: </span>
                <span className='text-white'>
                  {data.quantity}
                </span>
              </p>
              <p>
                <span>Created At: </span>
                <span className='text-white'>
                  {formatDate(data.createdDate)}
                </span>
              </p>
            </div>

            <div>
              <p className='mb-1 text-lg font-semibold text-zinc-300'>Description</p>
              <p>{data.description}</p>
            </div>
            
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
      <h3 className='text-3xl font-semibold ml-1'>{data!.name}</h3>
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

  return (
    (data!).variants.length ? (
      <div>               
        <p className='mb-2 text-xl font-semibold text-zinc-300'>Variants</p>
        <div className='w-full gap-3 flex flex-wrap'>
          {(data!).variants.map(({ name, linked_products }, idx) => (
            <div 
              className='bg-black/20 w-fit rounded-lg p-3 border border-white/10'
              key={idx}
            >
              <p className='text-lg mb-2 font-medium'>{name}</p>
              <div className='flex gap-3'>
                {linked_products.map((prod,idx) => (
                  <Button key={idx} asChild variant='primary'>
                    <Link href={prod.id.toString()}>  
                      {prod.value}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : ''
  )
}



export function ProductImageViewer () {
  const { data } = useGetProduct()

  return (
    <div className='w-1/3 h-fit'>
      {
        data?.images?.length ? (
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
        ) : ''
      }
    </div>
  )
}