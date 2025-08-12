import { UseFormRegister } from "react-hook-form";
import styled from "styled-components";

import FormControl from "./FormControl";
import Input from "../Input";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

const StyledCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export default function CommentsInput({
  register,
}: {
  register: UseFormRegister<any>;
}) {
  return (
    <FormControl testId="comments-input-container">
      <StyledLabel htmlFor="coments">
        Add Comments Section (optional)
      </StyledLabel>
      <p>
        Adding a commennts section increases engagement on your flyer. Users can
        ask questions, leave comments, and request more information. The
        comments are all saved to and centralized to the template.
      </p>
      <StyledCheckboxContainer>
        <Input type="checkbox" {...register("hasComments")} /> Check this box to
        add comments to your flyers
      </StyledCheckboxContainer>
    </FormControl>
  );
}
