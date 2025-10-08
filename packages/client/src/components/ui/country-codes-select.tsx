import { CountryCodeOptions } from "../../lib/constants/country-codes-options";
import Select, { SelectProps } from "./select/select";

function CountryCodesSelect ({ ...props }: Omit<SelectProps<JSX.Element, string>, 'options'>) {
  return (
    <div className="w-[80px]">
      <Select
        {...(props as SelectProps<JSX.Element, string>)}
        options={CountryCodeOptions}
      />
    </div>
  );
};


export default CountryCodesSelect
