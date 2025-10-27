import { ComponentProps, ElementRef, forwardRef, memo, useId } from "react"
import { useFormContext, useController } from "react-hook-form"
import { Textarea } from "../ui/textarea"
import { cn } from "../../lib/utils"

type TFormTextareaProps = {
  label?: string,
  name: string,
  showValidationMessage?: boolean
} & ComponentProps<typeof Textarea>

const FormTextarea = forwardRef<ElementRef<typeof Textarea>, TFormTextareaProps>(
  function (
    { 
      name, 
      showValidationMessage = true, 
      label, 
      defaultValue = "", 
      className, 
      ...props 
    }, 
    ref
  ) {

    if (!name) {
      throw new Error("FormTextarea must be provided with a 'name' prop")
    }

    const { control } = useFormContext()
    const { field, fieldState } = useController({
      name,
      control,
      defaultValue
    })

    const error = fieldState.error
    const inputId = useId()

    return (
      <div className="w-full">
        {label && (
          <label
            className={`text-sm mb-2 ${error ? "text-red-500" : ""}`}
            htmlFor={inputId}
          >
            {label} {error ? <span>*</span> : ""}
          </label>
        )}

        <Textarea
          {...field}
          className={cn(className, error ? "border-red-500" : "")}
          ref={ref}
          id={inputId}
          {...props}
        />

        {showValidationMessage && error && (
          <p className="text-red-500 mt-2 capitalize text-[12px]">
            {error.message}
          </p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = "FormTextarea"

export default memo(FormTextarea)
