import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import Select from "../Select";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

export default function CategoryInput({
  register,
  options,
  value,
  errors,
  showLabel = true,
}: {
  register: UseFormRegister<any>;
  options: { value: string; label: string }[];
  value: string;
  errors: FieldErrors<FieldValues>;
  showLabel?: boolean;
}) {
  return (
    <FormControl className="category" testId="category-container">
      {showLabel && (
        <StyledLabel
          htmlFor="category"
          className={`${errors["category"] && "error"}`}
        >
          Category
        </StyledLabel>
      )}
      <Select
        options={options}
        value={value}
        defaultValue={""}
        {...register("category", {
          required: { value: true, message: "Category is required" },
        })}
        hasError={Boolean(errors["category"])}
      />
      {errors["category"] && (
        <FieldInputError message={errors["category"]?.message as string} />
      )}
    </FormControl>
  );
}
