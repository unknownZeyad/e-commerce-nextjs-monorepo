'use client'

import CategoriesTree from "@/features/categories/components/categories-tree"
import CategoriesHeader from "@/features/categories/components/header"
import { useState } from "react"
import { useGetCategories } from "./hooks/use-get-categories"
import { array } from "@packages/client/src/lib/utils"

function Categories() {
  const { isLoading } = useGetCategories('')
  const [isCreating, setIsCreating] = useState<boolean>(false)

  return (
    <>
      <CategoriesHeader setIsCreating={setIsCreating}/>
      {
        isLoading ? (
          <div className="pl-4 border-l relative border-black/30 dark:border-white/30 space-y-4 ml-6">
            {array(0, 5).map((_,idx) => (
              <div className="relative pl-6 mt-3" key={idx}>
                <div className="h-[40px] relative w-[300px] skeleton"/>
                <span className="absolute left-[-16px] top-5 w-8 h-px bg-black/30 dark:bg-white/30"/>
              </div>
            ))}
          </div>
        ) : (
          <CategoriesTree
            isCreating={isCreating}
            setIsCreating={setIsCreating}
          />
        )
      }
    </>
  )
}

export default Categories