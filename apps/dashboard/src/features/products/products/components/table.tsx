'use client'

import Table from "@packages/client/src/components/ui/table"
import { useGetProducts } from "../hooks/use-get-products"
import { formatDate } from "@/core/lib/utils"
import Pagination from "@packages/client/src/components/ui/pagination"
import Link from "next/link"
import { FaImage } from 'react-icons/fa6'
import { array } from '@packages/client/src/lib/utils'

export default function ProductsTable () {
  const { data, isLoading } = useGetProducts()
  
  return (
    <Table columns='grid-cols-[50px_1fr_100px_100px_100px_200px]'>
      <Table.Header>
        <Table.Cell/>
        <Table.Cell>Name</Table.Cell>
        <Table.Cell>Price</Table.Cell>
        <Table.Cell>Discount</Table.Cell>
        <Table.Cell>Quantity</Table.Cell>
        <Table.Cell>Created Date</Table.Cell>
      </Table.Header>
      {(isLoading && !data) ? (
        <Table.Body
          data={array('',5)}
          render={(_,idx) => (
            <Table.Row key={idx}>
              <Table.Cell className="h-[40px] w-[40px] rounded-md skeleton"/>
              <Table.Cell className="h-[30px] rounded-md skeleton"/>
              <Table.Cell className="h-[30px] rounded-md skeleton"/>
              <Table.Cell className="h-[30px] rounded-md skeleton"/>
              <Table.Cell className="h-[30px] rounded-md skeleton"/>
              <Table.Cell className="h-[30px] rounded-md skeleton"/>
            </Table.Row>
          )}
        />
      ) : (
        <>
          <Table.Body
            data={(data!).products}
            render={({ 
              name, 
              price, 
              discountPercentage, 
              quantity, 
              createdDate, 
              images, 
              id 
            }) => (
              <Link key={id} href={`/dashboard/products/${id}`}>
                <Table.Row className='hover:bg-[#111]'>
                  <Table.Cell>
                    <div className="h-[40px] rounded-md w-[40px] overflow-hidden flex items-center justify-center bg-zinc-800 border border-white/10">
                      {
                        images?.[0] ? 
                        <img className='h-full w-full object-cover' src={images[0]}/> : 
                        <FaImage className="text-white/40 text-xl"/>
                      }
                    </div>
                  </Table.Cell>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{price}</Table.Cell>
                  <Table.Cell>{discountPercentage}%</Table.Cell>
                  <Table.Cell>{quantity}</Table.Cell>
                  <Table.Cell>{formatDate(createdDate)}</Table.Cell>
                </Table.Row>
              </Link>
            )}
          />
          <Table.Footer className='flex items-center justify-between gap-5'>
            <p className='text-sm font-medium'>Showing {data?.products.length} Products Out Of {data?.productsCount} Products</p>
            <div className="w-fit">
              <Pagination totalPages={(data!).totalPages}/>
            </div>
          </Table.Footer>
        </>
      )}
    </Table>
  )
}