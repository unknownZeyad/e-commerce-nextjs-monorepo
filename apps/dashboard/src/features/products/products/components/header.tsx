'use client'

import { SearchInput } from '@packages/client/src/components/ui/search-input'
import Link from 'next/link'
import { Button } from '@packages/client/src/components/ui/button'
import { FaPlus } from "react-icons/fa6";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@packages/client/src/components/ui/dropdown-menu'
import { Category } from '@packages/server/features/categories/model';
import { useGetCategories } from '@/features/categories/hooks/use-get-categories';
import { useState } from 'react';
import { useURLParams } from '@packages/client/src/hooks/use-url-params';
import { Checkbox } from '@packages/client/src/components/ui/checkbox';
import { cn } from '@packages/client/src/lib/utils';

function ProductsHeader() {
  return (
    <div className='flex items-center gap-6 mb-10 justify-between'>
      <div>
        <h3 className='text-3xl mb-1 font-semibold'>All Products</h3>
        <p className='text-white/60'>A summary of all your products and their current status.</p>
      </div>

      <div className="w-2/3 flex gap-4 items-center">
        <CategoriesFilter/>
        <SearchInput placeholder='Search For Products'/>
        <Link href='products/add'>
          <Button variant='primary' size='sm'>
            <FaPlus className='text-white'/>
            Add Product
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default ProductsHeader


function CategoriesFilter () {
  const { data } = useGetCategories('')
  const { get } = useURLParams()

  const selectedCategory = get('category-label')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {selectedCategory ? `Filtering By ${selectedCategory}` : 'Filter By Category'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit" align="start">
        {data?.map((curr) => (
          <SubCategoriesDropDown key={curr.id} category={curr}/>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SubCategoriesDropDown ({ category }: {
  category: Category
}) {
  const { id, parentPath, name } = category
  const [expanded, setExpanded] = useState<boolean>(false)
  const { data } = useGetCategories(parentPath + id + '/', expanded)
  const { get, setMultiple } = useURLParams()
  
  const isSelected = get('category-path') === `${parentPath}${id}`

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger
        className={cn(isSelected && 'bg-white/10')}
        onMouseEnter={() => setExpanded(true)}
        onClick={() => {
          setMultiple({
            'category-path': `${parentPath}${id}`,
            'category-label': name
          })
        }}
      >
        <Checkbox checked={isSelected}/>
        {name}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {data?.length ? 
            data.map((curr) => (
              <SubCategoriesDropDown key={curr.id} category={curr}/>
            )) : (
            <DropdownMenuLabel className='font-normal'>
              No Subcategories
            </DropdownMenuLabel>
          )}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
