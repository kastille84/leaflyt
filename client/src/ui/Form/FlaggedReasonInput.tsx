import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";
import { accessNestedProperty } from "../../utils/GeneralUtils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
  text-transform: capitalize;
`;

const StyledTextArea = styled.textarea<InputProps>`
  width: 40rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-brand-500);
  ${(props) =>
    props.hasError
      ? "border: 1px solid var(--color-orange-600);"
      : "border: 1px solid var(--color-brand-500);"}
`;

export default function FlaggedReasonInput({
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
    <FormControl testId={`${registerName}-container`}>
      <StyledLabel htmlFor={registerName} className={`${errorObj && "error"}`}>
        {registerName}
      </StyledLabel>
      <StyledTextArea
        type="text"
        id={registerName}
        {...register(registerName, {
          required: { value: true, message: `${registerName} is required` },
        })}
        hasError={Boolean(errorObj)}
      />
      {errorObj && <FieldInputError message={errorObj?.message as string} />}
    </FormControl>
  );
}
