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

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string>('')
  const uploadReturns = useUploadProductImages()

  const { images, uploadImage, deleteImage } = uploadReturns

  useEffect(() => {
    setSelectedImage(images[images.length-1])
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
        
        {images.length ? (
          <div className="w-full grid gap-3 grid-cols-[repeat(auto-fit,100px)] mt-4">
            {images.map((curr) => (
              <div 
                key={curr} 
                onClick={() => setSelectedImage(curr)}
                className={cn(
                  'w-full transition-all duration-200 relative aspect-square rounded-lg overflow-hidden group',
                  curr === selectedImage && 'ring-2 ring-white/50'
                )}
              >
                <img
                  src={`${config.imageBaseUrl}/${curr}`}
                  className="object-cover h-full w-full"
                  alt={curr}
                />

                <IoMdClose
                  onClick={() => deleteImage(curr)} 
                  className="text-white absolute cursor-pointer top-2 right-2 hover:bg-black/60 
                  duration-150 text-2xl p-1 rounded group-hover:opacity-100 opacity-0"
                />
              </div>
            ))}
          </div>
        ): ''}

        <FileUploadButton uploadImage={uploadImage}/>
      </CardContent>
    </Card>
  )
}

export default ImageUpload


function FileUploadButton ({ uploadImage }: {
  uploadImage: (file: File) => void
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
        onClick={() => fileInputRef.current?.click()}
      >
        <IoMdAdd className="text-4xl"/>
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