import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import Input from "../Input";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";
import { accessNestedProperty } from "../../utils/GeneralUtils";

const StyledLabel = styled.label`
  &.error {
    color: var(--color-orange-600);
  }
`;
export default function FullNameInput({
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
    <FormControl>
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
