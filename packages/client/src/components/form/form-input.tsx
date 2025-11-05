import { ComponentProps, ElementRef, forwardRef, memo, useId } from "react"
import { useFormContext, useController, Controller } from "react-hook-form"
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

type TFormInputProps = {
  label?: string,
  name: string,
  showValidationMessage?: boolean,
} & ComponentProps<typeof Input>

const FormInput = function ({ 
  name, 
  showValidationMessage = true, 
  label, 
  defaultValue = "", 
  className, 
  ...props 
}: TFormInputProps) {
  if (!name) {
    throw new Error("FormInput must be provided with a 'name' prop");
  }

  const { control } = useFormContext();
  const inputId = useId();

  return (
    <div className="w-full">
      <Controller
        name={name}
        defaultValue={defaultValue}
        control={control}
        render={({ field, fieldState }) => {
          return (
            <>
              {label && (
                <label
                  className={`text-sm ${fieldState.error ? "text-red-500" : ""} mb-2`}
                  htmlFor={inputId}
                >
                  {label} {fieldState.error ? <span>*</span> : ""}
                </label>
              )}
              <Input
                {...field}
                className={cn(className, fieldState.error ? "border-red-500" : "")}
                id={inputId}
                {...props}
              />
              {showValidationMessage && fieldState.error && (
                <p className="text-red-500 mt-2 capitalize text-[12px]">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )
        }}
      />
      
    </div>
  );
}


FormInput.displayName = "FormInput";

export default (FormInput);
