import Input from "../Input";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";

const StyledLabel = styled.label`
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
