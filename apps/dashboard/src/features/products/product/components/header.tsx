'use client'

import { Button } from "@packages/client/src/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

export function ProductHeader() {
  const { productId } = useParams<{ productId: string }>()

  return (
    <div className='flex items-center gap-6 mb-10 justify-between'>
      <div>
        <h3 className='text-3xl mb-1 font-semibold'>Products Details</h3>
        <p className='text-white/60 w-5/6'>A Detailed information about this product, including pricing, variants, and availability.</p>
      </div>

      <div className="w-fit flex gap-4 items-center">
        <Button asChild variant='outline' size='sm'>        
          <Link href={`${productId}/edit`}>
            <FaEdit className='text-white'/>
            Edit         
          </Link>
        </Button>
        <Button variant='destructive' size='sm'>
          <FaTrashAlt className='text-white'/>
          Delete 
        </Button>
      </div>
    </div>
  )
}