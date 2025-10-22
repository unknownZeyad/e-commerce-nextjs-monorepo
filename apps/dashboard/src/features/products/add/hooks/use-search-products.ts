import { Product } from "@packages/server/features/products/model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getProductsAction } from "../../products/actions";

export function useSearchProducts () {
  const qc = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: getProductsAction
  })

  return useCallback(async (query: string) => {
    try {
      const key = ['search_products', query]
      const cached = qc.getQueryData<Product[]>(key)  

      if (cached !== undefined) return cached
      const { products } = await mutateAsync({ 
        limit: 5, 
        page: 1, 
        columns: ['images','name', 'price', 'quantity', 'id'],
        filters: {
          name: query
        }
      })

      qc.setQueryData(key, products);
      return products
    } catch {
      return []
    }
  },[qc, mutateAsync])
}