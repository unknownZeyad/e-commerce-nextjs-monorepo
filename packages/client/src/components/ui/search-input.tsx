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
        'flex items-center pl-4 w-full rounded-xl border border-input bg-[#111]',
      )}
    >
      <IoSearch className="text-muted-foreground text-lg" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-4 py-2 text-lg w-full outline-0"
      />
    </div>
  )
}

export default SearchInput
