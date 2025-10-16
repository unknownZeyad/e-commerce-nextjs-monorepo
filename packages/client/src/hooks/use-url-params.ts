import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

export function useURLParams() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateURL = useCallback((params: URLSearchParams) => {
    const search = params.toString()
    const query = search ? `?${search}` : ""
    const newUrl = `${window.location.pathname}${query}`
    
    router.replace(newUrl, { scroll: false })
  }, [router])

  const set = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    updateURL(params)
  }, [searchParams, updateURL])

  const get = useCallback((name: string): string | null => {
    return searchParams.get(name)
  }, [searchParams])

  const remove = useCallback((name: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(name)
    updateURL(params)
  }, [searchParams, updateURL])

  const setMultiple = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value)
    })
    updateURL(params)
  }, [searchParams, updateURL])

  const clear = useCallback(() => {
    router.replace(window.location.pathname, { scroll: false })
  }, [router])

  const getAll = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }, [searchParams])

  const has = useCallback((name: string) => searchParams.has(name), [searchParams])

  return useMemo(() => ({
    set,
    get,
    delete: remove,
    remove,
    setMultiple,
    clear,
    getAll,
    has,
    toString
  }), [set, get, remove, setMultiple, clear, getAll, has, toString])
}