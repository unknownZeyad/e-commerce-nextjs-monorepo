'use client'

import { Button } from "@packages/client/src/components/ui/button";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

export function ProductHeader() {
  return (
    <div className='flex items-center gap-6 mb-10 justify-between'>
      <div>
        <h3 className='text-3xl mb-1 font-semibold'>Products Details</h3>
        <p className='text-white/60 w-5/6'>A Detailed information about this product, including pricing, variants, and availability.</p>
      </div>

      <div className="w-fit flex gap-4 items-center">
        <Link href=''>
          <Button variant='outline' size='sm'>
            <FaEdit className='text-white'/>
            Edit 
          </Button>
        </Link>
        <Button variant='destructive' size='sm'>
          <FaTrashAlt className='text-white'/>
          Delete 
        </Button>
      </div>
    </div>
  )
}