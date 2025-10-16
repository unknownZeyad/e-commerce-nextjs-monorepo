import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryAction } from "../actions";

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const { mutate: create, isPending } = useMutation<unknown, unknown,
    {
      name: string,
      parentPath: string,
      parentId?: number,
    }
  >({
    mutationFn: createCategoryAction,
    onSuccess(data, { parentPath }) {
      queryClient.invalidateQueries({ queryKey: ['categories', parentPath] })
      queryClient.invalidateQueries({ queryKey: ['category_full_path'] })
    },
  })

  return { create, isPending }
}