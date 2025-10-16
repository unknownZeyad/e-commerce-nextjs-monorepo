'use client'

import { ComponentProps, useEffect, useState } from 'react'
import { Option, SearchBox } from './search-box'
import { useDebounce } from 'use-debounce'

type AsyncSearchBoxProps = {
  fetchOptions: (search: string) => Promise<Option[]>
} & Omit<ComponentProps<typeof SearchBox>, 'options' | 'setSearch'>

function AsyncSearchBox({
  onChange, 
  value, 
  placeholder,
  fetchOptions,
}: AsyncSearchBoxProps) {
  const [options, setOptions] = useState<Option[]>([])
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch] = useDebounce<string>(search, 300)

  useEffect(() => {
    (async () => {
      try {
        const options = await fetchOptions(debouncedSearch)
        setOptions(options)
      } catch {
        setOptions([])
      }
    })()
  },[debouncedSearch])

  return (
    <SearchBox
      options={options}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      setSearch={setSearch}
    />
  )
}

export default AsyncSearchBox