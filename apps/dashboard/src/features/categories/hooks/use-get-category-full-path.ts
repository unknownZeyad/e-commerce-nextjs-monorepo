import { useQuery } from "@tanstack/react-query";
import { Category } from "@packages/server/features/categories/model";
import { getCategoriesFullPathAction } from "../actions";

export function useGetCategoryFullPath(fullPath: string, enabled?: boolean) {
  const { data, isLoading, error } = useQuery<Category[]>({
    queryKey: ['category_full_path', fullPath],
    queryFn: () => getCategoriesFullPathAction(fullPath),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled
  })

  return { data, isLoading, error }
}