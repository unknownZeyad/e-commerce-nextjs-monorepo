import { useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { useDebounce } from 'use-debounce'
import { useURLParams } from '../../hooks/use-url-params';

function SearchInput({
  placeholder = 'Search...',
}: {
  placeholder?: string;
}) {
  const params = useURLParams()
  const [value,setValue] = useState<string>(params.get("search")||"")
  const [debounceSearchInput] = useDebounce<string>(value,300)

  useEffect(()=>{
    if (debounceSearchInput) {
      params.set("search",debounceSearchInput)
    }else {
      params.delete("search")
    }
  },[
    debounceSearchInput,
    params,
  ])

  return (
    <div className='inline-flex w-[calc(100%-200px)] justify-between'>
      <div className='bg-white overflow-hidden w-1/3 border-zinc-200 border flex items-center rounded-xl h-[40px]'>
        <IoSearch className='text-4xl ml-4 text-zinc-600' />
        <input 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text" 
          placeholder={placeholder}
          className='w-full h-full ml-5 border-0 outline-0 text-2xl'
        />
      </div>
    </div>
  )
}

export default SearchInput
