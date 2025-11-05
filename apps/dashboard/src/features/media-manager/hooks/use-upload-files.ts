import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMediaFileAction } from "../actions";
import { useEffect, useRef, useState } from "react";

export function useUploadMediaFiles (params?: {
  onUpload: (uploaded: { 
    url: string, 
    public_id: string,
  }) => void
}) {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const qc = useQueryClient() 

  const { mutateAsync } = useMutation<{
    url: string,
    public_id: string
  }, unknown, {
    fileName: string,
    file: File
  }>({
    mutationFn: uploadMediaFileAction,
  })

  function upload (files: File[]) {
    if (isUploading) return
    setFilesToUpload(files)    
    setIsUploading(true)
  }
  
  useEffect(() => {
    (async () => {
      await Promise.all(filesToUpload.map((file) => mutateAsync({
      file,
      fileName: file.name.split('.')[0]
    }).then((res) => params?.onUpload(res))))
      setIsUploading(false)
      qc.invalidateQueries({
        queryKey: ['media_files']
      })
    })()
  },[filesToUpload])

  return {
    upload,
    isUploading
  }
}