'use client'

import { Handbag, Heart, Search, ShoppingBasket, UserRound } from "lucide-react"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { Button } from '@packages/client/src/components/ui/button'
import Marquee from "@/core/components/ui/marquee"

function Header() {
  const [isSearching, setIsSearching] = useState<boolean>(false)

  return (
    <header className='fixed z-50 w-full py-2 top-0 left-0 min-h-20'>
      <div className="container pt-3 pb-2 text-white h-full px-8 bg-black/20 rounded-xl backdrop-blur-2xl">
        <div className="gap-20 mb-2 justify-between flex items-center">
          <ul className="flex flex-1/2 font-secondary uppercase text-sm gap-6">
            <li>Shirts</li>
            <li>Hoodies</li>
            <li>Sweatpants</li>
            <li>Jackets</li>
          </ul>
          
          <p className='font-primary text-3xl'>Maison17</p>

          <div className='flex-1/2 items-center flex gap-3 justify-end'>
            <SearchBar
              setIsSearching={setIsSearching}
            />
            
            <button className="hover:bg-black/15 duration-150 cursor-pointer p-1 rounded-lg">
              <Heart className="w-[22px] h-[22px]"/>
            </button>
            <button className="hover:bg-black/15 duration-150 cursor-pointer p-1 rounded-lg">
              <UserRound className="w-[22px] h-[22px]"/>
            </button>
            <button className="hover:bg-black/15 duration-150 cursor-pointer p-1 rounded-lg">
              <Handbag className="w-[22px] h-[22px]"/>
            </button>
        
          </div>
        </div>

        <div className="bg-black/20 rounded px-1">
          <Marquee
            direction="neg"
            duration={10}
            itemClassName="text-sm"
            gap={3}
            items={[
              'Sales on All cloth up to 🔥 18%'
            ]}
          />
        </div>
      </div>
    </header>
  )
}

export default Header

function SearchBar ({ setIsSearching }: {
  setIsSearching: Dispatch<SetStateAction<boolean>>
}) {

  return (
    <div 
      onClick={() => setIsSearching(true)}
      className="gap-2 flex px-3 items-center hover:bg-black/20 duration-150 cursor-text w-[min(33vw,60%)] bg-black/10 py-1 rounded-full border border-white/60"
    >
      <Search className="h-6 w-6 top-0 left-0"/> 
      <input 
        className="outline-0 text-base placeholder:text-sm placeholder:text-white/70 w-full" 
        type="text" 
        placeholder="Search For Products"
      />
    </div>
  )
}