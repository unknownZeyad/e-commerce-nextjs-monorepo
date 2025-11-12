import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductAction } from "../actions";

export function useCreateProduct() {

  const queryClient = useQueryClient()
  const { mutate: create, isPending } = useMutation({
    mutationFn: createProductAction,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['search_products'] })
    },
  })

  return { create, isPending }
}