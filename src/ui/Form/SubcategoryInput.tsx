import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import Select from "../Select";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";

const StyledLabel = styled.label`
  &.error {
    color: var(--color-orange-600);
  }
`;

export default function SubcategoryInput({
  register,
  options,
  value,
  errors,
}: {
  register: UseFormRegister<any>;
  options: { value: string; label: string }[];
  value: string;
  errors: FieldErrors<FieldValues>;
}) {
  return (
    <FormControl className="subcategory">
      <StyledLabel
        htmlFor="subcategory"
        className={`${errors["subcategory"] && "error"}`}
      >
        Subcategory
      </StyledLabel>
      <Select
        options={options}
        value={value}
        defaultValue={""}
        {...register("subcategory", {
          required: { value: true, message: "Subcategory is required" },
        })}
        hasError={Boolean(errors["subcategory"])}
      />
      {errors["subcategory"] && (
        <FieldInputError message={errors["subcategory"]?.message as string} />
      )}
    </FormControl>
  );
}
