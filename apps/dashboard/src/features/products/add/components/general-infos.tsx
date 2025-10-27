import FormInput from '@packages/client/src/components/form/form-input'
import { Card, CardContent, CardHeader, CardTitle } from '@packages/client/src/components/ui/card'
import FormTextarea from '@packages/client/src/components/form/form-textarea'
import SelectCategoryDialog from './select-category-dialog'
import { Category } from '@packages/server/features/categories/model'
import { useFormContext, useWatch } from 'react-hook-form'
import { AddProductFormFields } from '../schema'

function AddProductGeneralInfos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product General Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <FormInput
          label='Product Name'
          placeholder='Enter Product Name'
          name='name'
          type='text'
        />

        <FormInput
          label='Brand Name'
          placeholder='Enter Brand Name'
          name='brand'
          type='text'
        />

        <FormTextarea
          label='Product Description'
          name='description'
          placeholder='Enter Product Description'
        />
        
        <SelectCategoryField/>
      </CardContent>
    </Card>
  )
}

export default AddProductGeneralInfos

function SelectCategoryField () {
  const { setValue, control, formState: { errors } } = useFormContext<AddProductFormFields>()
  const category = useWatch({
    control,
    name: 'category'
  })

  function setCategory (category: (Category|undefined)) {
    setValue('category', category)
  }

  return (
    <div>
      <SelectCategoryDialog
        selectedCategory={category}
        setSelectedCategory={setCategory}
      /> 
      {errors.category && (
        <p className='text-sm text-red-600 mt-2'>{errors.category.message}</p>
      )}
    </div>
  )
}