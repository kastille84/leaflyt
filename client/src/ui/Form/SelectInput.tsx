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

export default function SelectInput({
  register,
  registerName,
  options,
  value,
  errors,
}: {
  register: UseFormRegister<any>;
  registerName: string;
  options: { value: string; label: string }[];
  value: string;
  errors: FieldErrors<FieldValues>;
}) {
  const capitalized =
    registerName.charAt(0).toUpperCase() + registerName.slice(1);
  return (
    <FormControl
      className={`${registerName}`}
      testId={`${registerName}-container`}
    >
      <StyledLabel
        htmlFor={`${registerName}`}
        className={`${errors[`${registerName}`] && "error"}`}
      >
        {capitalized}
      </StyledLabel>
      <Select
        options={options}
        value={value}
        defaultValue={""}
        {...register(`${registerName}`, {
          required: { value: true, message: `${capitalized} is required` },
        })}
        hasError={Boolean(errors[`${registerName}`])}
      />
      {errors[`${registerName}`] && (
        <FieldInputError
          message={errors[`${registerName}`]?.message as string}
        />
      )}
    </FormControl>
  );
}
