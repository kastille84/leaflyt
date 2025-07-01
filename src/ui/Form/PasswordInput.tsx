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

export default function PasswordInput({
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
    <FormControl testId="password-container">
      <StyledLabel htmlFor="password" className={`${errorObj && "error"}`}>
        Password
      </StyledLabel>
      <Input
        type="password"
        id="password"
        {...register(registerName, {
          required: { value: true, message: "Password is required" },
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
        hasError={Boolean(errorObj)}
      />
      {errorObj && <FieldInputError message={errorObj?.message as string} />}
    </FormControl>
  );
}
