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

export default function LifespanInput({
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
    <FormControl className="lifespan" testId="lifespan-container">
      <StyledLabel
        htmlFor="lifespan"
        className={`${errors["lifespan"] && "error"}`}
      >
        Select the Lifespan
      </StyledLabel>
      <Select
        options={options}
        value={value}
        defaultValue={""}
        {...register("lifespan", {
          required: { value: true, message: "lifespan is required" },
        })}
        hasError={Boolean(errors["lifespan"])}
      />
      {errors["lifespan"] && (
        <FieldInputError message={errors["lifespan"]?.message as string} />
      )}
    </FormControl>
  );
}
