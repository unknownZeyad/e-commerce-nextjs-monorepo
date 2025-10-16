'use client'
import Table from '@packages/client/src/components/ui/table'
import Pagination from '@packages/client/src/components/ui/pagination'
import SearchInput from '@packages/client/src/components/ui/search-input'
import Link from 'next/link'
import { Button } from '@packages/client/src/components/ui/button'
import { useGetProducts } from './hooks/use-get-products'
import { FaImage } from 'react-icons/fa6'
import { array } from '@packages/client/src/lib/utils'

function Products() {
  const { data, isLoading } = useGetProducts()
  
  return (
    <>
      <div className='flex items-center gap-6 mb-10 justify-between'>
        <SearchInput/>
        <Link href='products/add'>
          <Button>
            Add Product
          </Button>
        </Link>
      </div>
      <Table columns='grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr]'>
        <Table.Header>
          <Table.Cell>Image</Table.Cell>
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
                <Table.Cell className="h-[50px] w-[50px] rounded-md skeleton"/>
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
                      <div className="h-[50px] rounded-lg w-[50px] flex items-center justify-center bg-zinc-800 border border-white/10">
                        {
                          images?.[0] ? 
                          <img src={images[0]}/> : 
                          <FaImage className="text-white/40 text-2xl"/>
                        }
                      </div>
                    </Table.Cell>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>{price}</Table.Cell>
                    <Table.Cell>{discountPercentage}%</Table.Cell>
                    <Table.Cell>{quantity}</Table.Cell>
                    <Table.Cell>{createdDate}</Table.Cell>
                  </Table.Row>
                </Link>
              )}
            />
            <Table.Footer className='flex justify-end'>
              <div className="w-fit">
                <Pagination totalPages={(data!).totalPages}/>
              </div>
            </Table.Footer>
          </>
        )}
      </Table>
    </>
  )
}

export default Products

