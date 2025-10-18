'use client'
import Table from '@packages/client/src/components/ui/table'
import Pagination from '@packages/client/src/components/ui/pagination'
import { SearchInput } from '@packages/client/src/components/ui/search-input'
import Link from 'next/link'
import { Button } from '@packages/client/src/components/ui/button'
import {  } from '@packages/client/src/components/ui/select'
import { useGetProducts } from './hooks/use-get-products'
import { FaImage } from 'react-icons/fa6'
import { array } from '@packages/client/src/lib/utils'
import { FaPlus } from "react-icons/fa6";
import { formatDate } from '@/core/lib/utils'

function Products() {
  
  return (
    <>
      <div className='flex items-center gap-6 mb-10 justify-between'>
        <div>
          <h3 className='text-3xl mb-1 font-semibold'>All Products</h3>
          <p className='text-white/60'>A summary of all your products and their current status.</p>
        </div>

        <div className="w-2/3 flex gap-4 items-center">
          <SearchInput placeholder='Search For Products'/>

          <Link href='products/add'>
            <Button variant='primary' size='sm'>
              <FaPlus className='text-white'/>
              Add Product
            </Button>
          </Link>
        </div>
      </div>
      <ProductsTable/>
    </>
  )
}

export default Products

function ProductsTable () {
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