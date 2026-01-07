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

export default function PlanInput({
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
    <FormControl className="plan" testId="plan-container">
      {showLabel && (
        <StyledLabel htmlFor="plan" className={`${errors["plan"] && "error"}`}>
          Select a Plan
        </StyledLabel>
      )}
      <Select
        options={options}
        value={value}
        defaultValue={""}
        {...register("plan", {
          required: { value: true, message: "plan is required" },
        })}
        hasError={Boolean(errors["plan"])}
      />
      {errors["plan"] && (
        <FieldInputError message={errors["plan"]?.message as string} />
      )}
    </FormControl>
  );
}
