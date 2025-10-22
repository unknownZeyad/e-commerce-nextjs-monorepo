'use client'

import { Card, CardContent, CardTitle, CardHeader } from "@packages/client/src/components/ui/card"
import { useUploadProductImages } from "../hooks/use-upload-product-images"
import { useEffect, useRef, useState } from "react"
import { FaImage } from "react-icons/fa6";
import { Button } from "@packages/client/src/components/ui/button";
import { config } from '@/core/config'
import { cn } from "@packages/client/src/lib/utils";
import { IoMdClose } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { ImSpinner8 } from "react-icons/im";
import { useFormContext } from "react-hook-form";
import { AddProductFormFields } from "../schema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@packages/client/src/components/ui/carousel"

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string>('')
  const { setValue } = useFormContext<AddProductFormFields>()
  const uploadReturns = useUploadProductImages()

  const { images, uploadImage, deleteImage, isUploading } = uploadReturns

  useEffect(() => {
    setSelectedImage(images[images.length-1])
    setValue('images',images.map((curr) => `${config.imageBaseUrl}/${curr}`))
  },[images])

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Upload Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl w-full border dark:border-white/20 overflow-hidden bg-white
        border-black/20 flex items-center justify-center aspect-square dark:bg-black">
          {selectedImage ? (
            <img 
              src={`${config.imageBaseUrl}/${selectedImage}`} 
              className="w-full h-full object-cover"
            />
          ): (
            <FaImage className="text-8xl text-white/30"/>
          )}
        </div>
        
        {
          images.length ? (
            <Carousel className="w-full">
              <CarouselContent className="flex mt-4 px-2">
                {images.map((curr) => (
                  <CarouselItem
                    onClick={() => setSelectedImage(curr)}
                    key={curr}
                    className='flex-[0_0_auto] transition-all py-1 duration-200 relative group'
                  >
                    <img
                      src={`${config.imageBaseUrl}/${curr}`}
                      className={cn(
                        "object-cover h-[80px] w-[80px] rounded-lg overflow-hidden",
                        curr === selectedImage && 'ring-2 ring-white/50'
                      )}
                      alt={curr}
                    />
                    <IoMdClose
                      onClick={() => deleteImage(curr)} 
                      className="text-white absolute cursor-pointer top-4 right-2 bg-red-600 hover:bg-red-700
                      duration-150 text-xl p-1 rounded group-hover:opacity-100 opacity-0"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : ''
        }
        
        <FileUploadButton 
          isUploading={isUploading} 
          uploadImage={uploadImage}
        />
      </CardContent>
    </Card>
  )
}

export default ImageUpload


function FileUploadButton ({ uploadImage, isUploading }: {
  uploadImage: (file: File) => void,
  isUploading: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    uploadImage(file!)
  }

  return (
    <>
      <Button
        className="mt-5 w-full space-x-3"
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {
          !isUploading ? 
          <IoMdAdd className="text-4xl"/> : 
          <ImSpinner8 className="text-3xl animate-spin"/>
        }
        Add Image
      </Button>
      <input 
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file" 
        className="hidden" 
      />
    </>
  )
}