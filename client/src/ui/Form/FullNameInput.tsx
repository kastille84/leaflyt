import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
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
export default function FullNameInput({
  register,
  registerName,
  name,
  errors,
  textLimit,
}: {
  register: UseFormRegister<any>;
  registerName: string;
  name: string;
  errors: FieldErrors<FieldValues>;
  textLimit?: number;
}) {
  function getErrorValue(errors: FieldErrors<FieldValues>) {
    return accessNestedProperty(errors, registerName);
  }

  const errorObj = getErrorValue(errors);

  const validationRules: RegisterOptions = {
    required: { value: true, message: `${name} Name is required` },
  };

  if (textLimit) {
    validationRules["maxLength"] = {
      value: textLimit,
      message: `${name} Name must be less than ${textLimit} characters`,
    };
  }

  return (
    <FormControl testId={`fullName-container`}>
      <StyledLabel htmlFor="name" className={`${errorObj && "error"}`}>
        {name} Name
      </StyledLabel>
      <Input
        type="text"
        id="name"
        {...register(registerName, validationRules)}
        hasError={Boolean(errorObj)}
      />
      {errorObj && <FieldInputError message={errorObj?.message as string} />}
    </FormControl>
  );
}
