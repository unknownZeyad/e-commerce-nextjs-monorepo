import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProductAction } from "../actions";
import { useParams } from 'next/navigation'
import { AddProductPayload } from "../../schema";

export function useEditProduct () {
  const qc = useQueryClient()
  const { productId } = useParams<{ productId: string }>()

  const { mutate: edit, isPending } = useMutation({
    mutationFn: (payload: AddProductPayload) => editProductAction({ id: +productId, payload }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['products']
      })
      qc.invalidateQueries({
        queryKey: ['product_with_variants', productId]
      })
    }
  })

  return { edit, isPending }
}