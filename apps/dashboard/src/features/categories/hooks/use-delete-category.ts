import { deleteCategoryAction } from "../actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const { mutate: deleteCat, isPending: isDeleting } = useMutation<
    void, 
    unknown,
    {
      parentPath: string,
      id: number
    }
  >({
    mutationFn: ({ id }) => deleteCategoryAction(id),
    onSuccess(data, { parentPath }) {
      queryClient.invalidateQueries({ queryKey: ['category_full_path'] })
      queryClient.invalidateQueries({ queryKey: ['categories', parentPath] })
    },
  })

  return { deleteCat, isDeleting }
}