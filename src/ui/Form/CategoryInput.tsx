import { UseFormRegister } from "react-hook-form";
import Select from "../Select";
import FormControl from "./FormControl";

export default function CategoryInput({
  register,
  options,
}: {
  register: UseFormRegister<any>;
  options: { value: string; label: string }[];
}) {
  return (
    <FormControl className="category">
      <label htmlFor="category">Category</label>
      <Select
        options={options}
        value=""
        {...register("category", {
          required: { value: true, message: "Category is required" },
        })}
      />
    </FormControl>
  );
}
