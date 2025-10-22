import { ComponentProps } from "react"
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form"


type FormProps<Fields extends FieldValues> = {
  form: UseFormReturn<Fields>,
  handleSubmit: (fields:Fields) => void
} & ComponentProps<"form">

export default function Form <T extends FieldValues>({ 
  form, 
  children, 
  handleSubmit:onSubmit,
  ...props 
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form 
        {...props} 
        onSubmit={form.handleSubmit(onSubmit)}
      >
       { children }
      </form>
    </FormProvider>
  )
}