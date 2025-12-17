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

export default function WebsiteInput({
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
    <FormControl testId="website-container">
      <StyledLabel htmlFor="website" className={`${errorObj && "error"}`}>
        Website (optional)
      </StyledLabel>
      <Input
        type="url"
        id="website"
        {...register(registerName)}
        placeholder="https://www.leaflit.com"
        hasError={Boolean(errorObj)}
      />
    </FormControl>
  );
}
