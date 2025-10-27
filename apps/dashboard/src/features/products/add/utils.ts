import { AddProductFormFields } from "./schema";

export function duplicateProductVariants (
  variant: AddProductFormFields['variants'][number],
  duplication: number, 
) {
  const duplicated = []

  for (let i = 0; i < duplication; i++) {
    const base = variant
    duplicated.push(base)
  }
    
  return duplicated 
}