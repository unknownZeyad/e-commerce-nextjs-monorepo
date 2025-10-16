import { getProductsAction } from "../actions"
import { useURLParams } from "@packages/client/src/hooks/use-url-params"
import { Product } from "@packages/server/features/products/model"
import { useQuery } from "@tanstack/react-query"

export function useGetProducts () {
  const { get } = useURLParams()

  const page = Number(get('page')) || 1
  const query = get('search') || '' 

  const { data, isLoading, error } = useQuery<{
    totalPages: number,
    currentPage: number,
    products: Product[]
  }>({
    queryKey: ['products', page, query],
    queryFn: () => getProductsAction({ 
      page, 
      query, 
      limit: 10,
    }),
    staleTime: 60 * 5 * 100,
    gcTime: 60 * 5 * 100,
  })

  return { data, isLoading, error }
}