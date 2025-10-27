import { useUpload } from "@/core/hooks/use-upload";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { v4 as uuid } from 'uuid';

export function useSmartUpload ({
  uploadKey
}: {
  uploadKey?: string
}) {
  const { current: key } = useRef<string>(uploadKey || uuid())

  const { deleteFile, uploadFile, isDeleting, isUploading } = useUpload()
  const [images, setImages] = useState<string[]>([])

  function setCache (images: string[]) {
    const old = JSON.parse(localStorage.getItem('uploading-images')!) || {}
    localStorage.setItem('uploading-images', JSON.stringify({ ...old, [key]: images }))
  }

  const uploadImage = (file: File) => {
    const fileName = uuid() + performance.now() + Date.now()
    uploadFile({ fileName, file },{
      onSuccess: () => {
        const imgs = [...images, fileName]
        setImages(imgs)
        setCache(imgs)
      }
    })
  }

  const deleteImage = (name: string) => {
    deleteFile(name,{
      onSuccess: () => {
        const imgs = images.filter(curr => curr !== name)
        setImages(imgs)
        setCache(imgs)
      }
    })
  }

  useLayoutEffect(() => {
    const cache = JSON.parse(localStorage.getItem('uploading-images')!) || {}
    if (cache[key]) setImages(cache[key])
  }, [])

  const clearAll = () => {
    for (const id of images) {
      deleteFile(id)
    }
    setCache([])
  }

  useEffect(() => {
    const listener = () => {
      setCache([])
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