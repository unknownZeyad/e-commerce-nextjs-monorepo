import FormInput from '@packages/client/src/components/form/form-input'
import { Card, CardContent, CardHeader, CardTitle } from '@packages/client/src/components/ui/card'
import FormTextarea from '@packages/client/src/components/form/form-textarea'
import SelectCategoryDialog from '../../components/select-category-dialog'
import { useEffect, useState } from 'react'
import { Category } from '@packages/server/features/categories/model'
import { useFormContext } from 'react-hook-form'
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
  const { setValue } = useFormContext<AddProductFormFields>()
  const [selectedCategory, setSelectedCategory] = useState<Category|undefined>()

  useEffect(() => {
    if (selectedCategory) {
      setValue('category_full_path',selectedCategory.parentPath+selectedCategory.id)
    }else {
      setValue('category_full_path', undefined!)
    }
  },[selectedCategory])

  return (
    <div>
      <SelectCategoryDialog
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      /> 
    </div>
  )
}