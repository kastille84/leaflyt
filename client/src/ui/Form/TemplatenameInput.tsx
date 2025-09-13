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
export default function TemplateNameInput({
  register,
  registerName,
  name,
  errors,
}: {
  register: UseFormRegister<any>;
  registerName: string;
  name: string;
  errors: FieldErrors<FieldValues>;
}) {
  function getErrorValue(errors: FieldErrors<FieldValues>) {
    return accessNestedProperty(errors, registerName);
  }

  const errorObj = getErrorValue(errors);

  return (
    <FormControl testId={`templateName-container`}>
      <StyledLabel htmlFor="name" className={`${errorObj && "error"}`}>
        {name} Name
      </StyledLabel>
      <Input
        type="text"
        id="name"
        {...register(registerName, {
          required: { value: true, message: `${name} Name is required` },
        })}
        hasError={Boolean(errorObj)}
      />
      {errorObj && <FieldInputError message={errorObj?.message as string} />}
    </FormControl>
  );
}
