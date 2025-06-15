import { UseFormRegister } from "react-hook-form";
import Select from "../Select";
import FormControl from "./FormControl";

export default function SubcategoryInput({
  register,
  options,
  value,
}: {
  register: UseFormRegister<any>;
  options: { value: string; label: string }[];
  value: string;
}) {
  return (
    <FormControl className="subcategory">
      <label htmlFor="subcategory">Subcategory</label>
      <Select
        options={options}
        value={value}
        defaultValue={""}
        {...register("subcategory", {
          required: { value: true, message: "Subcategory is required" },
        })}
      />
    </FormControl>
  );
}
