import { useQuery } from "@tanstack/react-query";
import { getMediaFilesAction } from "../actions";
import { useEffect, useRef, useState } from "react";
import { CloudinaryAssetsResponse } from "../types";

export function useGetMediaFiles () {
  const [currentPage,setCurrentPage] = useState<number>(1)
  const pagesCursors = useRef<Record<number, string>>({
    1: undefined!
  })

  const { data, isLoading, error } = useQuery<CloudinaryAssetsResponse>({
    queryFn: () => getMediaFilesAction({ 
      type: 'image',
      limit: 20,
      next_cursor: pagesCursors.current[currentPage]
    }),
    queryKey: ['media_files', currentPage],
    staleTime: Infinity,
    gcTime: Infinity,
  })

  useEffect(() => {
    if (data?.next_cursor)
      pagesCursors.current[currentPage+1] = data.next_cursor
  },[data])

  const next = () => setCurrentPage((page) => page+1)
  const previous = () => setCurrentPage((page) => page-1)

  return { data: data?.resources, isLoading, error, previous, next }
}