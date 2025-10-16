import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function array <T>(filling: T, length: number) {
  return Array(length).fill(filling) as T[]
}