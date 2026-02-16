import { Control, Controller } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { FieldErrors, FieldValues } from "react-hook-form";
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

export default function ContentInput({
  control,
  errors,
}: {
  control: Control<FieldValues, any, FieldValues>;
  errors: FieldErrors;
}) {
  return (
    <FormControl testId="content-container">
      <StyledLabel
        htmlFor="description"
        className={`${errors["content"] && "error"}`}
      >
        Content
      </StyledLabel>
      <Controller
        control={control}
        name="content"
        defaultValue={""}
        render={({ field }) => (
          <ReactQuill
            className={` ${errors["content"] && "error"}`}
            {...field}
            theme="snow"
            placeholder="Spread your message..."
          />
        )}
        rules={{
          required: { value: true, message: "Content is required" },
          validate: (value) => {
            if (value === "<p><br></p>") {
              return "Content is required";
            }
            return true;
          },
        }}
      />
      {errors["content"] && (
        <FieldInputError message={errors["content"]?.message as string} />
      )}
    </FormControl>
  );
}
