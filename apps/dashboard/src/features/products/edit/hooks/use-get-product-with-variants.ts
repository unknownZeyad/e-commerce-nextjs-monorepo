import { useQuery } from "@tanstack/react-query";
import { getProductWithVariantsAction } from "../actions";
import { useParams } from 'next/navigation'

export function useGetProductWithVariants () {
  const { productId } = useParams<{ productId: string }>()

  const { data, isLoading, error } = useQuery({
    queryFn: () => getProductWithVariantsAction(+productId),
    queryKey: ['product', productId],
    staleTime: Infinity,
    gcTime: 0
  })

  return { data, isLoading, error }
}