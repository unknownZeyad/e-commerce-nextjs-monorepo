import { getProductsAction } from "../actions"
import { useURLParams } from "@packages/client/src/hooks/use-url-params"
import { Product } from "@packages/server/features/products/model"
import { useQuery } from "@tanstack/react-query"

export function useGetProducts () {
  const { get } = useURLParams()

  const page = Number(get('page')) || 1
  const limit = Number(get('limit')) || 10
  const query = get('search') || '' 

  const { data, isLoading, error } = useQuery<{
    totalPages: number,
    currentPage: number,
    products: Product[],
    productsCount: number
  }>({
    queryKey: ['products', page, query, limit],
    queryFn: () => getProductsAction({ 
      page, 
      query, 
      limit,
      queryKeys: ['name']
    }),
    staleTime: 60 * 5 * 1000,
    gcTime: 60 * 5 * 1000,
  })

  return { data, isLoading, error }
}