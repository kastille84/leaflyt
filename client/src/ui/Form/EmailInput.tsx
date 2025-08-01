import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import Input from "../Input";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";
import { accessNestedProperty } from "../../utils/GeneralUtils";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

export default function EmailInput({
  register,
  registerName,
  errors,
}: {
  register: UseFormRegister<any>;
  registerName: string;
  errors: FieldErrors<FieldValues>;
}) {
  function getErrorValue(errors: FieldErrors<FieldValues>) {
    return accessNestedProperty(errors, registerName);
  }

  const errorObj = getErrorValue(errors);
  return (
    <FormControl testId="email-container">
      <StyledLabel htmlFor="email" className={`${errorObj && "error"}`}>
        Email
      </StyledLabel>
      <Input
        type="email"
        id="email"
        {...register(registerName, {
          required: { value: true, message: "Email is required" },
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Regex for email format
            message: "Invalid email address", // Error message if pattern doesn't match
          },
        })}
        hasError={Boolean(errorObj)}
      />
      {errorObj && <FieldInputError message={errorObj?.message as string} />}
    </FormControl>
  );
}
