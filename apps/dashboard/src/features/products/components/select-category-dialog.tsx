'use client'

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription } from '@packages/client/src/components/ui/dialog'
import { Checkbox } from '@packages/client/src/components/ui/checkbox'
import { Category } from "@packages/server/features/categories/model"
import { useGetCategories } from "@/features/categories/hooks/use-get-categories"
import { ChevronRight, ChevronRightIcon } from "lucide-react"
import { cn } from "@packages/client/src/lib/utils"
import { Button } from "@packages/client/src/components/ui/button"
import { useGetCategoryFullPath } from "@/features/categories/hooks/use-get-category-full-path"

const Context = createContext<{
  setSelectedCategory: Dispatch<SetStateAction<Category|undefined>>,
  selectedCategory?: Category,
  
}>({
  setSelectedCategory: () => {},
  selectedCategory: undefined
})

function SelectCategoryDialog({ 
  setSelectedCategory,           
  selectedCategory,
}: {
  setSelectedCategory: Dispatch<SetStateAction<Category|undefined>>,
  selectedCategory?: Category
}) {
  const [isOpen, setIsOpen]= useState<boolean>(false)
  const { data } = useGetCategories('')

  return (
    <Context
      value={{
        setSelectedCategory, 
        selectedCategory,
      }}
    >
      <Dialog 
        onOpenChange={setIsOpen}
        open={isOpen}
      >
        <SelectCategoryButton setIsOpen={setIsOpen}/>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Category</DialogTitle>
            <DialogDescription className="capitalize mt-2 text-sm w-3/4">
              Select The Exact Category for your product, You can Choose Weather To select a Parent Or A SubCategory
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden p-5 w-[464px] mt-4 bg-black h-[300px] ring-1 ring-white/15">
            <div className="overflow-auto max-h-full">
              <ul className="relative pl-4 border-l border-l-black/30 dark:border-white/30 space-y-1 ml-4">
                {data?.map(category => (
                  <SubTree 
                    key={category.id} 
                    category={category} 
                  />
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Context>
  )
}

export default SelectCategoryDialog

function SelectCategoryButton ({ setIsOpen }: {
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { selectedCategory } = useContext(Context)
  const isSelected = !!selectedCategory
  const fullPath = isSelected ? selectedCategory?.parentPath + selectedCategory?.id : ''
  const { data, isLoading, error } = useGetCategoryFullPath(fullPath, isSelected)

  const open = () => setIsOpen(true)

  return (
    <div className="flex flex-col">
      <label className='text-sm mb-2'>
        Select Category
      </label>
      <Button 
        disabled={isLoading}
        onClick={open}
        className="justify-start h-fit bg-background border border-white/10"
        variant='secondary'
        type="button" 
      >
        {
          isSelected ? (
            <div className="flex-wrap flex gap-2">
              {
                data?.map((curr, index) => (
                  <div key={curr.id} className="flex gap-2 items-center">
                    <p>{curr.name}</p>
                    {index < data.length - 1 && (
                      <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                ))
              }
            </div>
          ) : 'Select Category'
        }
      </Button>
    </div>
  )
}

function SubTree ({ category }: {
  category: Category,
}) {
  const { setSelectedCategory, selectedCategory } = useContext(Context)
  const { name, parentPath, id } = category
  const isDefaultOpen = selectedCategory?.parentPath.includes(category.id.toString()) ?? false
  const [expanded, setExpanded] = useState<boolean>(isDefaultOpen)
  const { data, isLoading } = useGetCategories(parentPath + id + '/', expanded)

  
  const toggleExpansion = () => setExpanded((prev) => !prev)
  const isChecked = category.id === selectedCategory?.id

  return (
     <li className="relative pl-6 mt-3">
      <span className="absolute left-[-16px] top-3 w-8 h-px bg-black/30 dark:bg-white/30"/>
      <div className="flex w-max bg-zinc-900 p-1 pl-2 rounded-lg items-center gap-2">
        <Checkbox 
          checked={isChecked} 
          onCheckedChange={() => {
            if (!isChecked) setSelectedCategory(category)
            else setSelectedCategory(undefined)
          }}
        />
        <div className="flex gap-2 items-center" onClick={toggleExpansion}>
          <p>{name}</p>
          <ChevronRight
            className={cn(
              'w-[20px] h-[20px] duration-150 transition-transform',
              expanded ? 'rotate-90' : 'rotate-0'
            )}
          />
        </div>
      </div>

      {expanded && !isLoading && (
        <ul className="pl-4 ml-2 border-l relative space-y-3 border-black/30 dark:border-white/30">
          {
            data?.length ? 
            data.map(category => (
              <SubTree 
                key={category.id} 
                category={category} 
              />
            )) :
            <p className="text-sm text-white/50 mt-4 w-max">No Subcategories</p>
          }
        </ul>
      )}
    </li>
  )
}