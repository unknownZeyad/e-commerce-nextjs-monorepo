import { ComponentProps, ElementRef, forwardRef, memo, useId } from "react"
import { useFormContext, useController } from "react-hook-form"
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

type TFormInputProps = {
  label?: string,
  name: string,
  showValidationMessage?: boolean,
} & ComponentProps<typeof Input>

const FormInput = forwardRef<ElementRef<typeof Input>, TFormInputProps>(
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
      throw new Error("FormInput must be provided with a 'name' prop");
    }

    const { control } = useFormContext();
    const { field, fieldState } = useController({
      name,
      control,
      defaultValue
    });

    const error = fieldState.error;
    const inputId = useId();

    return (
      <div className="w-full">
        {label && (
          <label
            className={`text-sm ${error ? "error" : ""} mb-2`}
            htmlFor={inputId}
          >
            {label} {error ? <span>*</span> : ""}
          </label>
        )}

        <Input
          {...field}
          className={cn(className, error ? "error" : "")}
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
    );
  }
);

FormInput.displayName = "FormInput";

export default memo(FormInput);
