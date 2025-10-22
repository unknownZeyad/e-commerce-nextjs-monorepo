import { useQuery } from "@tanstack/react-query";
import { getProductAction } from "../action";
import { useParams } from 'next/navigation'
import { Product } from "@packages/server/features/products/model";

export function useGetProduct () {
  const { productId } = useParams<{ productId: string }>()

  const { data, isLoading, error } = useQuery<Product>({
    queryFn: () => getProductAction(+productId),
    queryKey: ['product', productId],
    staleTime: Infinity,
    gcTime: 0
  })

  return { data, isLoading, error }
}