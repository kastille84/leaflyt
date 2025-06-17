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
    <FormControl>
      <StyledLabel htmlFor="website" className={`${errorObj && "error"}`}>
        Website
      </StyledLabel>
      <Input
        type="url"
        id="website"
        {...register(registerName, {
          required: { value: true, message: "Website is required" },
        })}
        placeholder="https://example.com"
        hasError={Boolean(errorObj)}
      />
      {errorObj && <FieldInputError message={errorObj?.message as string} />}
    </FormControl>
  );
}
