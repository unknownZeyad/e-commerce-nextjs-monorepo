import { useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"

export function useURLParams () {
  const searchParams = useSearchParams()

  const currentParams = (() => {
    let params: Record<string, string> = {}
    searchParams.forEach((value: string, key: string) => params = { ...params, [key]: value })
    return params
  })()

  const methods = useMemo(() => ({
    set(name: string, value: string) {
      currentParams[name] = value
      const stringified = Object.keys(currentParams)
      .reduce((acc,key) => acc + `${key}=${currentParams[key]}&`,"?")

      const newUrl = `${window.location.pathname}?${stringified}`
      window.history.replaceState(null, "", newUrl)
    },
    get(name: string) {
      return currentParams[name]
    },
    delete (name: string) {
      
    }
  }),[currentParams])

  return methods
}