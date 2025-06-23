import ReactAutocompleteTagbox from "react-autocomplete-tagbox";
import { Control, Controller, UseFormGetValues } from "react-hook-form";
import { FieldErrors, FieldValues } from "react-hook-form";
import styled from "styled-components";

import FormControl from "./FormControl";

const StyledLabel = styled.label`
  &.error {
    color: var(--color-orange-600);
  }
`;
export default function TagsInput({
  control,
  errors,
  getValues,
}: {
  control: Control<FieldValues, any, FieldValues>;
  errors: FieldErrors;
  getValues: UseFormGetValues<any>;
}) {
  // https://www.npmjs.com/package/react-autocomplete-tagbox
  return (
    <FormControl>
      <StyledLabel htmlFor="tags" className={`${errors["tags"] && "error"}`}>
        Tags
      </StyledLabel>
      <Controller
        control={control}
        name="tags"
        defaultValue={[]}
        render={({ field }) => (
          <ReactAutocompleteTagbox
            {...field}
            tags={getValues("tags")}
            placeholder="Add tags..."
            className={`tag-input ${errors["tags"] && "error"}`}
            limit={6}
          />
        )}
      />
    </FormControl>
  );
}
