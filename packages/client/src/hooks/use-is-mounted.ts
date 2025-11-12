import { useEffect, useRef, useState } from 'react'

export function useIsMounted(deps?: any[]) {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    if (!isMounted) setIsMounted(true)
  }, deps||[])

  return isMounted
}
