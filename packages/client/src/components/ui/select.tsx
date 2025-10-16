import { SelectValue } from '@radix-ui/react-select'
import { BaseSelect, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup } from '../ui/base-select' 
import { ReactNode } from 'react'

export type Option = {
  label: ReactNode,
  value: string
}

function Select({ options, onChange, defaultValue, value }:{
  options: Option[],
  defaultValue?: string,
  value?: string,
  onChange: (val: string) => void
}) {
  return (
    <BaseSelect 
      defaultValue={defaultValue}
      onValueChange={onChange}
      value={value}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          
          <SelectItem value="apple">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍎</span>
              <span>Apple</span>
            </div>
          </SelectItem>
          
          <SelectItem value="banana">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍌</span>
              <span>Banana</span>
            </div>
          </SelectItem>
          
          <SelectItem value="blueberry">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🫐</span>
              <span>Blueberry</span>
            </div>
          </SelectItem>
          
          <SelectItem value="grapes">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍇</span>
              <div>
                <div className="font-medium">Grapes</div>
                <div className="text-xs text-gray-500">Purple or green</div>
              </div>
            </div>
          </SelectItem>
          
          <SelectItem value="pineapple">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍍</span>
              <span>Pineapple</span>
            </div>
          </SelectItem>
          
        </SelectGroup>
      </SelectContent>
    </BaseSelect>
  )
}

export default Select