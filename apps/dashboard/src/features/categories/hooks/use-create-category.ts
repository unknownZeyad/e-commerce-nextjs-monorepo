import { createCategoryAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    },
  })

  return { create, isPending }
}