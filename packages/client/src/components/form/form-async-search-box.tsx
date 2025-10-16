import { ComponentProps, memo, useId } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import AsyncSearchBox from '../ui/async-search-box'

type FormAsyncSearchBoxProps = {
  label?: string,
  name: string,
  showValidationMessage?: boolean,
} & Omit<ComponentProps<typeof AsyncSearchBox>, "onChange" | "value">

function FormAsyncSearchBox({
  label,
  name,
  showValidationMessage = true,
  ...props
}: FormAsyncSearchBoxProps) {
  if (!name)
    throw new Error("FormSelect must be provided with a 'name' prop")

  const { control } = useFormContext()
  const { field: { ref, ...field }, fieldState } = useController({
    name,
    control
  })

  const error = fieldState.error
  const selectId = useId()

  return (
    <div className="w-full h-full">
      {label && (
        <label
          className={`mb-[0.8rem] ${error ? 'error' : ''}`}
          htmlFor={selectId}
        >
          {label} {error ? <span>*</span> : ''}
        </label>
      )}

      <AsyncSearchBox
        {...field}
        {...props}
      />

      {showValidationMessage && error && (
        <p className="text-red-500 capitalize text-[12px] mt-2">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default FormAsyncSearchBox
