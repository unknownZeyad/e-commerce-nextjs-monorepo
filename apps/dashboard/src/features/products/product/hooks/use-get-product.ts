import { useQuery } from "@tanstack/react-query";
import { getProductAction } from "../action";
import { useParams } from 'next/navigation'
import { Product } from "@packages/server/features/products/model";
import { useURLParams } from "@packages/client/src/hooks/use-url-params";

export function useGetProduct () {
  const { productId } = useParams<{ productId: string }>()
  const { get } = useURLParams()

  const sku = get('sku') || undefined

  const { data, isLoading, error } = useQuery({
    queryFn: () => getProductAction(+productId, sku),
    queryKey: ['product', productId, sku],
    staleTime: Infinity,
    gcTime: 0
  })

  return { data, isLoading, error }
}