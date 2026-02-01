import Input from "../Input";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

export default function TitleInput({
  register,
  errors,
}: {
  register: UseFormRegister<any>;
  errors: FieldErrors<FieldValues>;
}) {
  return (
    <FormControl className="title" testId="title-container">
      <StyledLabel htmlFor="title" className={`${errors["title"] && "error"}`}>
        Title
      </StyledLabel>
      <Input
        type="text"
        id="title"
        {...register("title", {
          required: { value: true, message: "Title is required" },
          maxLength: { value: 75, message: "Title must be less than 75 chars" },
        })}
        placeholder="Something Eye Catching..."
        hasError={Boolean(errors["title"])}
      />
      {errors["title"] && (
        <FieldInputError message={errors["title"]?.message as string} />
      )}
    </FormControl>
  );
}
