'use client'
import Table from '@packages/client/src/components/ui/table'
import Pagination from '@packages/client/src/components/ui/pagination'
import SearchInput from '@packages/client/src/components/ui/search-input'
import Link from 'next/link'
import { Button } from '@packages/client/src/components/ui/button'

function Products() {
  return (
    <div>
      <div className='flex items-center gap-6 mb-10 justify-between'>
        <SearchInput/>
        <Link href='products/add'>
          <Button>
            Add Product
          </Button>
        </Link>
      </div>
      <Table columns='grid-cols-[1fr_1fr_1fr_1fr]'>
        <Table.Header>
          <Table.Cell>Name</Table.Cell>
          <Table.Cell>Price</Table.Cell>
          <Table.Cell>Discount</Table.Cell>
          <Table.Cell>Created Date</Table.Cell>
        </Table.Header>
        <Table.Body
          data={[]}
          render={() => (
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Price</Table.Cell>
              <Table.Cell>Discount</Table.Cell>
              <Table.Cell>Created Date</Table.Cell>
            </Table.Row>
          )}
        />
        <Table.Footer>
          <Pagination 
            page={{
              current:3,
              has_previous: true,
              has_next: true,
               pages: 300
            }}
             total={20}

          />
        </Table.Footer>
      </Table>
    </div>
  )
}

export default Products