'use client'

import { Button } from '@packages/client/src/components/ui/button'
import { FaPlus } from "react-icons/fa6";
import React, { Dispatch, memo, SetStateAction } from 'react'

function CategoriesHeader({ setIsCreating }: {
  setIsCreating: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <div className='flex items-center gap-6 mb-10 justify-between'>
      <div>
        <h3 className='text-3xl mb-1 font-semibold'>Categories</h3>
        <p className='text-white/60'>Manage Categories and Sub-categories.</p>
      </div>

      <Button 
        onClick={() => setIsCreating(true)} 
        variant='primary' 
        size='sm'
      >
        <FaPlus className='text-white'/>
        Add Base Category
      </Button>
    </div>
  )
}

export default memo(CategoriesHeader)