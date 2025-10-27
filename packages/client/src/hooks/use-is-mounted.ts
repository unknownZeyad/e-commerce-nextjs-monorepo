import { useEffect, useRef, useState } from 'react'

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    if (!isMounted) setIsMounted(true)
  }, [])

  return isMounted
}
