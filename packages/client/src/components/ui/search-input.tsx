'use client'

import { useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { useDebounce } from 'use-debounce'
import { useURLParams } from '../../hooks/use-url-params'
import { cn } from '../../lib/utils'

type SearchInputProps = {
  placeholder?: string
}

export function SearchInput({ placeholder = 'Search...' }: SearchInputProps) {
  const params = useURLParams()
  const [value, setValue] = useState(params.get('search') || '')
  const [debounceSearchInput] = useDebounce(value, 300)

  useEffect(() => {
    if (debounceSearchInput) {
      params.set('search', debounceSearchInput)
    } else {
      params.delete('search')
    }
  }, [debounceSearchInput, params])

  return (
    <div
      className={cn(
        'flex items-center pl-3 w-full rounded-lg border border-input bg-light-black',
      )}
    >
      <IoSearch className="text-muted-foreground text-xl" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-3 py-2 text-lg w-full placeholder:text-base outline-0"
      />
    </div>
  )
}

export default SearchInput
