import { useQuery } from "@tanstack/react-query";
import { Category } from "@packages/server/features/categories/model";
import { getSubCategoriesAction } from "@/actions";

export function useGetCategories(path?: string, enable?: boolean) {
  const { data, isLoading, error } = useQuery<Category[]>({
    queryKey: ['categories', path],
    queryFn: () => getSubCategoriesAction(path),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: enable 
  })

  return { data, isLoading, error }
}