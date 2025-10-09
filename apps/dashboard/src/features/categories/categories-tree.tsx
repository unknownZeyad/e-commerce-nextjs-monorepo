'use client'

import { Dispatch, useRef, useState } from "react"
import { useGetCategories } from "./hooks/use-get-catgories"
import { Category } from "@packages/server/features/categories/model"
import { Input } from "@packages/client/src/components/ui/input"
import { Button } from "@packages/client/src/components/ui/button"
import { Check, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import { cn } from "@packages/client/src/lib/utils"
import { useCreateCategory } from "./hooks/use-create-category"
import { useDeleteCategory } from "./hooks/use-delete-category"
import { useEditCategory } from "./hooks/use-edit-category"
import { RiBallPenFill } from "react-icons/ri";

function CategoriesTree() {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const { data } = useGetCategories('')

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h1 className="text-xl mb-4">Categories</h1>
        <Button
          variant='secondary'
          onClick={() => setIsCreating(true)}
        >Add Base Category</Button>
      </div>
      <ul className="pl-4 border-l relative border-black/30 dark:border-white/30 space-y-1 ml-6">
        {data?.map(category => (
          <SubTree key={category.id} category={category} />
        ))}
        {
          isCreating && (
            <CreateCategoryField 
              setIsCreating={setIsCreating}
              parentPath=''
            />
          )
        }
      </ul>
    </div>
  )
}

function SubTree ({ category }: {
  category: Category
}) {
  const { name, parentPath, id } = category

  const [expanded, setExpanded] = useState<boolean>(false)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const { data, isLoading } = useGetCategories(parentPath + id + '/', expanded)
  const { deleteCat, isDeleting } = useDeleteCategory()

  const close = () => {
    setExpanded(!expanded)
    setIsCreating(false)
  }

  const add = () => {
    setExpanded(true)
    setIsCreating(true)
  }

  const deleteCategory = (id: number) => {
    if (!isDeleting) 
    deleteCat({
      id,
      parentPath
    })
  }

  return (
    <li className="relative pl-6 mt-3">
      <span className="absolute left-[-16px] top-5 w-8 h-px bg-black/30 dark:bg-white/30"/>
      
      <div className="flex items-center gap-2">
        {
          isEditing ? (
            <EditCategoryField category={category} setIsEditing={setIsEditing}/>
          ) : (
            <>
              <button
                onClick={close} 
                className={cn( 
                  "flex items-center px-4 py-2 gap-2 bg-black/7 hover:bg-black/20 dark:bg-white/7 dark:hover:bg-white/20 rounded-lg duration-150 cursor-pointer",
                  expanded ? 'dark:bg-white/20 bg-black/20' : 'bg-transparent'
                )}
              >
                <p className="text-lg">{name}</p>
                <ChevronRight 
                  className={cn(
                    'w-[20px] h-[20px] duration-150 transition-transform',
                    expanded ? 'rotate-90' : 'rotate-0'
                  )}
                />
              </button>
              <Plus  
                className="w-[30px] h-[30px] rounded-lg cursor-pointer p-1 dark:hover:bg-white/10"
                onClick={add}
              />

              <Trash2  
                className="w-[30px] h-[30px] rounded-lg cursor-pointer text-red-600 p-1 dark:hover:bg-red-500/20"
                onClick={() => deleteCategory(id)}
              />
              
              <RiBallPenFill  
                className="w-[30px] h-[30px] rounded-lg cursor-pointer text-yellow-600 p-1 dark:hover:bg-yellow-500/20"
                onClick={() => setIsEditing(true)}
              />
            </>
          )
        }
      </div>

      {expanded && !isLoading && (
        <ul className="pl-4 ml-3 border-l relative space-y-3 border-black/30 dark:border-white/30 ">
          {
            data?.length ? 
            data.map(category => (
              <SubTree key={category.id} category={category} />
            )) :
            <p className="text-sm text-white/50 mt-4">No Subcategories</p>
          }
          {
            isCreating && (
              <CreateCategoryField 
                parentId={id}
                setIsCreating={setIsCreating}
                parentPath={parentPath + id + '/'}
              />
            )
          }
        </ul>
      )}
    </li>
  )   
}

export default CategoriesTree


function EditCategoryField ({ setIsEditing, category }: {
  setIsEditing: Dispatch<React.SetStateAction<boolean>>,
  category: Category
}) {
  const { edit, isEditing } = useEditCategory()
  const inputRef = useRef<HTMLInputElement>(null)

  const { id, parentPath, name } = category

  function handleEdit () {
    const value = inputRef.current?.value
    if (!value) 
      return inputRef.current?.focus()

    if (!isEditing)
    edit({ name: value, id, parentPath },{
      onSuccess: () => setIsEditing(false)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Input 
        className="w-[250px]" 
        type="text" 
        defaultValue={name}
        ref={inputRef} 
        placeholder="Enter Category Name"
      />
      <X 
        onClick={() => setIsEditing(false)}
        className="hover:bg-red-500/20 bg-red-500/10 duration-150 text-red-500 cursor-pointer p-1 w-[25px] h-[25px] rounded-lg" 
      />
      <Check
        onClick={handleEdit}
        className="hover:bg-green-500/20 bg-green-500/10 duration-150 text-green-500 cursor-pointer p-1 w-[25px] h-[25px] rounded-lg" 
      />
    </div>
  )
}

function CreateCategoryField ({ parentPath, setIsCreating, parentId }: {
  parentPath: string,
  setIsCreating: Dispatch<React.SetStateAction<boolean>>,
  parentId?: number
}) {
  const { isPending, create } = useCreateCategory()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleCreate () {
    const value = inputRef.current?.value
    if (!value) 
      return inputRef.current?.focus()

    if (!isPending)
    create({ name: value, parentPath, parentId },{
      onSuccess: () => setIsCreating(false)
    })
  }

  return (
    <li className="mt-2 pl-6">
      <div className="absolute left-0 bottom-5 w-[32px] h-[1px] bg-black/30 dark:bg-white/30"/>
      <div className="flex items-center gap-2">
        <Input 
          className="w-[250px]" 
          type="text" 
          ref={inputRef} 
          placeholder="Enter Category Name"
        />
        <X 
          onClick={() => setIsCreating(false)}
          className="hover:bg-red-500/20 bg-red-500/10 duration-150 text-red-500 cursor-pointer p-1 w-[25px] h-[25px] rounded-lg" 
        />
        <Check
          onClick={handleCreate}
          className="hover:bg-green-500/20 bg-green-500/10 duration-150 text-green-500 cursor-pointer p-1 w-[25px] h-[25px] rounded-lg" 
        />
      </div>
    </li>
  )
}