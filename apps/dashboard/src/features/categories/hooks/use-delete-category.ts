import { deleteCategoryAction } from "@/actions";
import { useMutation, useQueryClient } from "react-query";

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const { mutate: deleteCat, isLoading: isDeleting } = useMutation<
    void, 
    unknown,
    {
      parentPath: string,
      id: number
    }
  >({
    mutationFn: ({ id }) => deleteCategoryAction(id),
    onSuccess(data, { parentPath }) {
      console.log
      queryClient.invalidateQueries({ queryKey: ['categories', parentPath] })
    },
  })

  return { deleteCat, isDeleting }
}