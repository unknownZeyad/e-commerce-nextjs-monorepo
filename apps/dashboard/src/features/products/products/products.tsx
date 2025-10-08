'use client'
import Table from '@packages/client/src/components/ui/table'

function Products() {
  return (
    <div>
      <Table columns='grid-cols-[1fr_1fr_1fr_fr]'>
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
      </Table>
    </div>
  )
}

export default Products