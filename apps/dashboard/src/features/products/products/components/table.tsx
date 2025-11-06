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
    <Table 
      horizontalAlignment="center" 
      columns='grid-cols-[45px_minmax(120px,1fr)_80px_80px_80px_80px_80px_minmax(100px,200px)]'
    >
      <Table.Header>
        <Table.Cell/>
        <Table.Cell>Name</Table.Cell>
        <Table.Cell>Brand</Table.Cell>
        <Table.Cell>Price</Table.Cell>
        <Table.Cell>Discount</Table.Cell>
        <Table.Cell>Quantity</Table.Cell>
        <Table.Cell>Total Orders</Table.Cell>
        <Table.Cell>Created Date</Table.Cell>
      </Table.Header>
      {(isLoading && !data) ? (
        <Table.Body
          data={array('',5)}
          render={(_,idx) => (
            <Table.Row key={idx}>
              <Table.Cell className="h-[45px] w-[45px] rounded-md skeleton"/>
              <Table.Cell className="h-[30px] rounded-md skeleton"/>
              <Table.Cell className="h-[30px] rounded-md skeleton"/>
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
              images,
              id,
              orderCount,
              brand,
              createdAt,
              discountPercentage,
              price,
              quantity
            }) => (
              <Link key={id} href={`/dashboard/products/${id}`}>
                <Table.Row className='hover:bg-[#111]'>
                  <Table.Cell>
                    <div className="w-full aspect-square bg-light-black border rounded-lg overflow-hidden border-white/20 flex items-center justify-center">
                      {images[0] ? (
                        <img src={images[0]} alt="" />
                      ) : <FaImage className="text-2xl text-white/50"/>}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{brand}</Table.Cell>
                  <Table.Cell>{price}</Table.Cell>
                  <Table.Cell>{discountPercentage}%</Table.Cell>
                  <Table.Cell>{quantity}</Table.Cell>
                  <Table.Cell>{orderCount}</Table.Cell>
                  <Table.Cell>{formatDate(createdAt)}</Table.Cell>
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