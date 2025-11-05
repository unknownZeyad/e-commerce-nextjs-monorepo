import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMediaFileAction } from "../actions";

export function useDeleteMediaFile () {
  const qc = useQueryClient()

  const {
    mutate: deleteFile, 
    isPending: isDeleting 
  } = useMutation <unknown, unknown, string>({
    mutationFn: deleteMediaFileAction,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['media_files']
      })
    }
  })

  return { deleteFile, isDeleting }
}