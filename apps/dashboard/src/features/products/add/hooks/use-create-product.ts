import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductAction } from "../actions";
import { useRouter } from "next/navigation";

export function useCreateProduct() {
  const { push } = useRouter()
  const queryClient = useQueryClient()
  const { mutate: create, isPending } = useMutation({
    mutationFn: createProductAction,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['search_products'] })
      localStorage.setItem('uploading-images', JSON.stringify([]))
      push('/dashboard/products')
    },
  })

  return { create, isPending }
}