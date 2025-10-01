import { createCategoryAction } from "@/actions";
import { useMutation, useQueryClient } from "react-query";

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const { mutate: create, isLoading } = useMutation({
    mutationFn: createCategoryAction,
    onSuccess(data, { parentPath }) {
      queryClient.invalidateQueries({ queryKey: ['categories', parentPath] })
    },
  })

  return { create, isLoading }
}