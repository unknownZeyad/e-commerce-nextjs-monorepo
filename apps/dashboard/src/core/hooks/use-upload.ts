import { useMutation } from "@tanstack/react-query";
import { deleteFileAction, uploadFileAction } from "../actions";

export function useUpload () {
  const { 
    mutate: uploadFile, 
    isPending: isUploading 
  } = useMutation<unknown, unknown, {
    fileName: string,
    file: File
  }>({
    mutationFn: uploadFileAction,
  })

  const {
    mutate: deleteFile, 
    isPending: isDeleting 
  } = useMutation <unknown, unknown, string>({
    mutationFn: deleteFileAction,
  })

  return { isUploading, isDeleting, uploadFile, deleteFile }
}