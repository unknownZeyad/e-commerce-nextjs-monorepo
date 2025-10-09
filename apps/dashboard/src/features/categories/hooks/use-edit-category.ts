import { updateCategoryAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditCategory() {
  const queryClient = useQueryClient()
  const { mutate: edit, isPending: isEditing } = useMutation<void, void,
    {
      id: number,
      name: string,
      parentPath: string
    }
  >({
    mutationFn: ({ id, name }) => updateCategoryAction(id, { name }),
    onSuccess(data, { parentPath }) {
      queryClient.invalidateQueries({ queryKey: ['categories', parentPath] })
    },
  })

  return { edit, isEditing }
}