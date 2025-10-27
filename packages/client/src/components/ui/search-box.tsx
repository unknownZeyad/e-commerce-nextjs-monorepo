"use client"

import * as React from "react"
import { ChevronsUpDownIcon, Search } from "lucide-react"

import { Button } from "./button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { cn } from "../../lib/utils"

export type Option = {
  label: React.ReactNode,
  value: string | number
}

export function SearchBox({ 
  onChange,
  options, 
  value, 
  placeholder = 'Search',
  setSearch,
}: {
  options: Option[],
  value: Option | null,
  onChange: (val: Option) => void,
  placeholder?: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
}) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const [open, setOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    !open && setSearch('')
  },[open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger ref={ref} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-fit overflow-hidden "
        >
          {value?.label || placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        style={{
          width: ref.current?.clientWidth,
          padding: 0
        }} 
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
          <div className="flex items-center border-b border-white/10 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder={placeholder}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
              )}
            />
          </div>
          <ul className="max-h-[300px] space-y-1 p-1 overflow-y-auto overflow-x-hidden">
            {options.map((option) => (
              <li
                className={cn(
                  "relative hover:bg-white/10 flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  value && (option.value === value.value) && 'bg-white/10'
                )}
                key={option.value}
                value={option.value}
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  )
}