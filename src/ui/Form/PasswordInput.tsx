import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import Input from "../Input";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";
import { accessNestedProperty } from "../../utils/GeneralUtils";
import { useState } from "react";

const StyledLabel = styled.label`
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

const StyledLabelItem = styled.span`
  &:last-child {
    cursor: pointer;
  }
`;

export default function PasswordInput({
  register,
  registerName,
  errors,
  shouldShow = false,
}: {
  register: UseFormRegister<any>;
  registerName: string;
  errors: FieldErrors<FieldValues>;
  shouldShow?: boolean;
}) {
  const [show, setShow] = useState(shouldShow);
  function getErrorValue(errors: FieldErrors<FieldValues>) {
    return accessNestedProperty(errors, registerName);
  }

  function handleToggle() {
    setShow((prevShow) => !prevShow);
  }

  const errorObj = getErrorValue(errors);
  return (
    <FormControl testId="password-container">
      <StyledLabel htmlFor="password" className={`${errorObj && "error"}`}>
        <StyledLabelItem>Password</StyledLabelItem>
        <StyledLabelItem onClick={handleToggle}>
          {show ? "Hide" : "Show"}
        </StyledLabelItem>
      </StyledLabel>
      <Input
        type={show ? "text" : "password"}
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
