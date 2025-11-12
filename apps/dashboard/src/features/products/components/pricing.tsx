import FormInput from '@packages/client/src/components/form/form-input'
import { Card, CardContent, CardHeader, CardTitle } from '@packages/client/src/components/ui/card'

function AddProductPricing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing And Stock</CardTitle>
      </CardHeader>
      <CardContent className='gap-3 grid grid-cols-2'>
        <FormInput
          label='Price'
          name='price'
          min={1}
          type='number'
          placeholder='Enter Product Price'
        />

        <FormInput
          label='Quantity'
          name='quantity'
          type='number'
          min={1}
          placeholder='Enter Product Quantity'
        />

        <FormInput
          label='Discount Percent'
          min={0}
          defaultValue='0'
          placeholder='Enter Product Discount'
          name='discount_percentage'
          type='number'
        />
      </CardContent>
    </Card>
  )
}

export default AddProductPricing