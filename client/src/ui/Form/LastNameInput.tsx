import { FieldErrors, FieldValues, RegisterREturn } from "react-hook-form";
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
export default function LastNameInput({
  register,
  registerName,
  errors,
}: {
  register: RegisterREturn<any>;
  registerName: string;
  errors: FieldErrors<FieldValues>;
}) {
  function getErrorValue(errors: FieldErrors<FieldValues>) {
    return accessNestedProperty(errors, registerName);
  }

  const errorObj = getErrorValue(errors);

  return (
    <FormControl testId="lastName-container">
      <StyledLabel htmlFor="last-name" className={`${errorObj && "error"}`}>
        Last Name
      </StyledLabel>
      <Input
        type="text"
        id="last-name"
        {...register(registerName, {
          required: { value: true, message: "Last Name is required" },
        })}
        hasError={Boolean(errorObj)}
      />
      {errorObj && <FieldInputError message={errorObj?.message as string} />}
    </FormControl>
  );
}
