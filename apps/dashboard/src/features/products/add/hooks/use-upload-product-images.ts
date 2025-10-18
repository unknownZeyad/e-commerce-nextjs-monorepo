import { useUpload } from "@/core/hooks/useUpload";
import { useEffect, useLayoutEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

export function useUploadProductImages () {
  const { deleteFile, uploadFile, isDeleting, isUploading } = useUpload()
  const [images, setImages] = useState<string[]>([])

  const uploadImage = (file: File) => {
    const fileName = uuid() + performance.now() + Date.now()
    uploadFile({ fileName, file },{
      onSuccess: () => {
        const imgs = [...images, fileName]
        setImages(imgs)
        localStorage.setItem('uploading-images', JSON.stringify(imgs))
      }
    })
  }

  const deleteImage = (name: string) => {
    deleteFile(name,{
      onSuccess: () => {
        const imgs = images.filter(curr => curr !== name)
        setImages(imgs)
        localStorage.setItem('uploading-images', JSON.stringify(imgs))
      }
    })
  }

  const clearAll = () => {
    for (const id of images) {
      deleteFile(id)
    }
  }

  useLayoutEffect(() => {
    const local = JSON.parse(localStorage.getItem('uploading-images')!)
    if (Array.isArray(local)) setImages((local))
  },[])

   useEffect(() => {
    const listener = () => {
      localStorage.setItem('uploading-images', JSON.stringify([]))  
      for (const id of images) {
        navigator.sendBeacon('/api/files/delete', JSON.stringify({ id }))
      }
    }
    window.addEventListener("beforeunload", listener);
    return () => window.removeEventListener('beforeunload', listener)
  },[images])

  return {
    images,
    uploadImage,
    deleteImage,
    isDeleting,
    isUploading,
    clearAll
  }
}